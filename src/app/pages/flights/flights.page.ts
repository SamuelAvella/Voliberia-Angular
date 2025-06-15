/**
 * Página de gestión de vuelos.
 * Permite visualizar, añadir, editar y eliminar vuelos.
 * Solo accesible para usuarios con permisos de administrador.
 */
import { Component, Inject, OnInit } from "@angular/core";
import { AlertController, ModalController, ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, lastValueFrom, Observable } from "rxjs";
import { Flight } from "src/app/core/models/flight.model";
import { Paginated } from "src/app/core/models/paginated.model";
import { BookingsStrapiRepositoryService } from "src/app/core/repositories/impl/bookings-strapi-repository.service";
import { FLIGHTS_COLLECTION_SUBSCRIPTION_TOKEN } from "src/app/core/repositories/repository.token";
import { BookingsService } from "src/app/core/services/impl/bookings.service";
import { FlightsService } from "src/app/core/services/impl/flights.service";
import { CollectionChange, ICollectionSubscription } from "src/app/core/services/interfaces/collection-subscription.interface";
import { FlightModalComponent } from "src/app/shared/components/flight-modal/flight-modal.component";

@Component({
  selector: 'app-flights',
  templateUrl: './flights.page.html',
  styleUrls: ['./flights.page.scss'],
})
export class FlightsPage implements OnInit {
  /** Lista observable de vuelos */
  _flights: BehaviorSubject<Flight[]> = new BehaviorSubject<Flight[]>([]);

  /** Observable para los vuelos */
  flights$: Observable<Flight[]> = this._flights.asObservable();

  /** Página actual para paginación */
  page: number = 1;

  /** Tamaño de página para la paginación */
  pageSize: number = 25;

  /** Idioma actual */
  currentLocale: string;

  /** IDs de vuelos ya cargados para evitar duplicados */
  private loadedIds: Set<String> = new Set();


  /**
   * Constructor. Inyecta servicios y configura el idioma.
   * @param flightsSvc Servicio de vuelos
   * @param modalCtrl Controlador de modales
   * @param alertCtrl Controlador de alertas
   * @param bookingsSvc Servicio de reservas
   * @param toastController Controlador de toasts
   * @param translateService Servicio de traducción
   * @param flightsSubscription Suscripción a cambios en vuelos
   */
  constructor(
    private flightsSvc: FlightsService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private bookingsSvc: BookingsService,
    private toastController: ToastController,
    private translateService: TranslateService,
    @Inject(FLIGHTS_COLLECTION_SUBSCRIPTION_TOKEN)
    private flightsSubscription: ICollectionSubscription<Flight>

  ) {
    this.currentLocale = this.translateService.currentLang || 'en-US';
    this.translateService.onLangChange.subscribe((event) => {
      this.currentLocale = event.lang; // Cambiar idioma cuando se actualice
    });
  }

  /**
   * Inicializa la página y se suscribe a cambios en tiempo real de vuelos.
   */
  ngOnInit(): void {
    this.getMoreFlights();

    this.flightsSubscription.subscribe('fligths').subscribe((change: CollectionChange<Flight>) => {
      const currentFlight = [...this._flights.value];

      if (!this.loadedIds.has(change.id) && change.type !== "added") return;

      switch (change.type) {
        case 'added':
        case 'modified':
          const index = currentFlight.findIndex(f => f.id === change.id);
          if (index >= 0) {
            currentFlight[index] = change.data!;
          }
          break;
        case 'removed':
          const removeIndex = currentFlight.findIndex(f => f.id === change.id);
          if (removeIndex >= 0) {
            currentFlight.splice(removeIndex, 1);
            this.loadedIds.delete(change.id);
          }
          break;
      }

      this._flights.next(currentFlight);
    });
  }

  /**
   * Carga más vuelos usando paginación y actualiza la lista.
   * @param notify Elemento opcional para scroll infinito.
   */
  getMoreFlights(notify: HTMLIonInfiniteScrollElement | null = null): void {
    this.flightsSvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Flight>) => {
        response.data.forEach(flight => this.loadedIds.add(flight.id));
        const updatedFlights = [...this._flights.value];

        response.data.forEach(flight => {
          const index = updatedFlights.findIndex(f => f.id === flight.id);
          if (index >= 0) {
            updatedFlights[index] = flight;
          } else {
            updatedFlights.push(flight);
          }
        });

        updatedFlights.sort((a, b) =>
          new Date(b.departureDate).getTime() - new Date(a.departureDate).getTime()
        );

        this._flights.next(updatedFlights);
        this.page++;
        notify?.complete();
      },
      error: (err) => {
        console.error('Error cargando vuelos:', err);
        notify?.complete();
      },
    });
  }

  /**
   * Abre un modal para crear un nuevo vuelo.
   */
  async onAddFlight(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: FlightModalComponent,
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        await lastValueFrom(this.flightsSvc.add(result.data));
        await this.showToast('FLIGHT.SUCCESS.CREATE');
        this.refreshFlights();
      }
    });

    await modal.present();
  }

  /**
   * Abre un modal para editar un vuelo existente.
   * @param flight Vuelo a editar
   */
  async onEditFlight(flight: Flight): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: FlightModalComponent,
      componentProps: { flight },
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        await lastValueFrom(this.flightsSvc.update(flight.id, result.data));
        await this.showToast('FLIGHT.SUCCESS.EDIT');
        this.refreshFlights();
      }
    });

    await modal.present();
  }

  /**
   * Muestra una alerta para confirmar la eliminación de un vuelo.
   * También elimina sus reservas asociadas.
   * @param flight Vuelo a eliminar
   */
  async onDeleteFlight(flight: Flight): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: await this.translateService.get('FLIGHT.DELETE_CONFIRM.TITLE').toPromise(),
      message: await this.translateService.get('FLIGHT.DELETE_CONFIRM.MESSAGE').toPromise(),
      buttons: [
        {
          text: await this.translateService.get('FLIGHT.DELETE_CONFIRM.CANCEL').toPromise(),
          role: 'cancel',
        },
        {
          text: await this.translateService.get('FLIGHT.DELETE_CONFIRM.DELETE').toPromise(),
          role: 'destructive',
          handler: async () => {
            try {
              await lastValueFrom(this.bookingsSvc.deleteBookingsByFlightId(flight.id));
              await lastValueFrom(this.flightsSvc.delete(flight.id));
              await this.showToast('FLIGHT.SUCCESS.DELETE');
              this.refreshFlights();
            } catch (error) {
              console.error('❌ Error eliminando vuelo:', error);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Muestra un mensaje toast con una clave de traducción.
   * @param key Clave de traducción
   */
  private async showToast(key: string): Promise<void> {
    const toast = await this.toastController.create({
      message: this.translateService.instant(key),
      duration: 3000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }

  /**
   * Reinicia la lista de vuelos y vuelve a cargar desde la página 1.
   */
  refreshFlights(): void {
    this.page = 1;
    this._flights.next([]);
    this.loadedIds.clear();
    this.getMoreFlights();
  }

  /**
   * Llama a la carga de más vuelos al hacer scroll infinito.
   * @param ev Evento del scroll
   */
  onIonInfinite(ev: any): void {
    this.getMoreFlights(ev.target);
  }
}