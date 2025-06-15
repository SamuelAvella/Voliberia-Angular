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
  _flights: BehaviorSubject<Flight[]> = new BehaviorSubject<Flight[]>([]);
  flights$: Observable<Flight[]> = this._flights.asObservable();
  page: number = 1;
  pageSize: number = 25;

  currentLocale: string;
  private loadedIds: Set<String> = new Set()


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

  ngOnInit(): void {
    this.getMoreFlights();
    this.flightsSubscription.subscribe('fligths').subscribe((change: CollectionChange<Flight>) =>{
      console.log('Cambio recibido de la suscripción de vuelos:', change);  // Log del cambio
      const currentFlight = [...this._flights.value];

      if(!this.loadedIds.has(change.id) && change.type !== "added"){
        console.log('El vuelo no ha sido cargado o no es un vuelo añadido');  // Log si no es un vuelo nuevo
        return;
      }

      switch(change.type) {
        case 'added':
        case 'modified':
          console.log(`Vuelo ${change.type}:`, change.data);  // Log de los vuelos añadidos o modificados
          const index = currentFlight.findIndex(f => f.id === change.id);
          if (index >= 0) {
            currentFlight[index] = change.data!;
          }
          break;
        case 'removed':
          console.log(`Vuelo removido:`, change.id);  // Log de vuelos eliminados
          const removeIndex = currentFlight.findIndex(f => f.id === change.id);
          if (removeIndex >= 0) {
            currentFlight.splice(removeIndex, 1);
            this.loadedIds.delete(change.id);
          }
          break;
        }

        this._flights.next(currentFlight);
      }
    )
  }

  getMoreFlights(notify: HTMLIonInfiniteScrollElement | null = null): void {
    console.log('Llamando a getMoreFlights');
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

        // Sort descendent date
        updatedFlights.sort((a, b) => new Date(b.departureDate).getTime() - new Date(a.departureDate).getTime());

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


  async onAddFlight() {
    const modal = await this.modalCtrl.create({
      component: FlightModalComponent,
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        await lastValueFrom(this.flightsSvc.add(result.data));

        const toastSuccess = await this.toastController.create({
          message: this.translateService.instant('FLIGHT.SUCCESS.CREATE'), // Cambia al mensaje que quieras
          duration: 3000,
          position: 'bottom',
          color: 'success',
        });
        await toastSuccess.present();

        this.refreshFlights();
      }
    });
    await modal.present();
  }

  async onEditFlight(flight: Flight) {
    const modal = await this.modalCtrl.create({
      component: FlightModalComponent,
      componentProps: { flight },
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        await lastValueFrom(this.flightsSvc.update(flight.id, result.data));

        const toast = await this.toastController.create({
          message: this.translateService.instant('FLIGHT.SUCCESS.EDIT'),
          duration: 3000,
          position: 'bottom',
          color: 'success',
        });
        await toast.present();

        this.refreshFlights();
      }
    });

    await modal.present();
  }


  async onDeleteFlight(flight: Flight) {
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

              const toast = await this.toastController.create({
                message: this.translateService.instant('FLIGHT.SUCCESS.DELETE'),
                duration: 3000,
                position: 'bottom',
                color: 'success',
              });
              await toast.present();

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





  refreshFlights(): void {
  console.log('Llamando a refreshFlights');
  this.page = 1;
  this._flights.next([]);      // Limpia la lista actual
  this.loadedIds.clear();      // Limpia los IDs para evitar duplicados
  this.getMoreFlights();       // Carga desde cero
}



  onIonInfinite(ev: any) {
    this.getMoreFlights(ev.target);
  }
}
