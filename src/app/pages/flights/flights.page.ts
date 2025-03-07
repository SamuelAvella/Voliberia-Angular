import { Component, Inject, OnInit } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Observable } from "rxjs";
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
        // const existingIds = this._flights.value.map((flight) => flight.id);
        // const newFlights = response.data.filter((flight) => !existingIds.includes(flight.id));
        
        // const sortedFlights = [...this._flights.value, ...newFlights]
        //   .sort((a, b) => a.origin.localeCompare(b.origin)); 

        this._flights.next([...this._flights.value, ...response.data]);
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
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.flightsSvc.add(result.data).subscribe(() => {
          console.log('Vuelo agregado, refrescando lista');
          this.refreshFlights();
        });
      }
    });
  
    await modal.present();
  }
  
  async onEditFlight(flight: Flight) {
    const modal = await this.modalCtrl.create({
      component: FlightModalComponent,
      componentProps: { flight },
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.flightsSvc.update(flight.id, result.data).subscribe(() => {
          console.log('Vuelo editado, refrescando lista');
          this.refreshFlights();
        });
      }
    });
  
    await modal.present();
  }
  
  async onDeleteFlight(flight: Flight) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this booking?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.bookingsSvc.deleteBookingsByFlightId(flight.id).subscribe({
              next: () => {
                this.flightsSvc.delete(flight.id).subscribe(() => {
                  console.log('Vuelo eliminado, refrescando lista');
                  this.refreshFlights();
                });
              },
              error: (err) => console.error('Error eliminando bookings:', err),
            });
          },
        },
      ],
    });

    await alert.present();
  }
  
  
  

  refreshFlights(): void {
    console.log('Llamando a refreshFlights');
    this.page = 1; // Reinicia la paginación
    this._flights.next([]); // Limpia la lista actual
    this.getMoreFlights(); // Carga vuelos desde la primera página
  }
  

  onIonInfinite(ev: any) {
    this.getMoreFlights(ev.target);
  }
}