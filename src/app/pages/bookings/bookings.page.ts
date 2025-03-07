import { Component, Inject, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Booking } from 'src/app/core/models/booking.model';
import { Flight } from 'src/app/core/models/flight.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { BOOKINGS_COLLECTION_SUBSCRIPTION_TOKEN, FLIGHTS_COLLECTION_SUBSCRIPTION_TOKEN } from 'src/app/core/repositories/repository.token';
import { BookingsService } from 'src/app/core/services/impl/bookings.service';
import { FlightsService } from 'src/app/core/services/impl/flights.service';
import { CollectionChange, ICollectionSubscription } from 'src/app/core/services/interfaces/collection-subscription.interface';
import { BookingModalComponent } from 'src/app/shared/components/booking-modal/booking-modal.component';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  private _bookings = new BehaviorSubject<Booking[]>([]);
  bookings$: Observable<Booking[]> = this._bookings.asObservable();

  _flights: BehaviorSubject<Flight[]> = new BehaviorSubject<Flight[]>([]);
  flights$: Observable<Flight[]> = this._flights.asObservable();

  flightsMap: { [flightId: string]: Flight } = {};
  private page: number = 1;
  private readonly pageSize: number = 25;
  private loading: boolean = false;

  currentLocale: string;
  private loadedIds: Set<String> = new Set()


  constructor(
    private bookingsSvc: BookingsService,
    private flightsSvc: FlightsService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private translateService: TranslateService,
    @Inject(BOOKINGS_COLLECTION_SUBSCRIPTION_TOKEN)
    private bookingsSubscription: ICollectionSubscription<Booking>,

    @Inject(FLIGHTS_COLLECTION_SUBSCRIPTION_TOKEN)
    private flightsSubscription: ICollectionSubscription<Flight> 
  ) {
    this.currentLocale = this.translateService.currentLang || 'en-US';
    this.translateService.onLangChange.subscribe((event) => {
      this.currentLocale = event.lang; 
    });
  }

  ngOnInit(): void {
    this.loadAllFlights(); 
    this.loadBookings();
    this.bookingsSubscription.subscribe('bookings').subscribe((change: CollectionChange<Booking>) =>{
      const currentBooking = [...this._bookings.value];

      if(!this.loadedIds.has(change.id) && change.type !== "added"){
        return;
      }

      switch(change.type) {
        case 'added':
        case 'modified':
          const index = currentBooking.findIndex(f => f.id === change.id);
          if (index >= 0) {
            currentBooking[index] = change.data!;
          }
          break;
        case 'removed':
          const removeIndex = currentBooking.findIndex(f => f.id === change.id);
          if (removeIndex >= 0) {
            currentBooking.splice(removeIndex, 1);
            this.loadedIds.delete(change.id);
          }
          break;
        }

        this._bookings.next(currentBooking)
      }
    )

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

  loadBookings(notify: HTMLIonInfiniteScrollElement | null = null): void {
    if (this.loading) return; // Evitar solicitudes múltiples simultáneamente
    this.loading = true;

    this.bookingsSvc
      .getAll(this.page, this.pageSize)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({  
        next: (response: Paginated<Booking>) => {
          response.data.forEach(booking => this.loadedIds.add(booking.id));
          const currentBookings = this._bookings.value;
          const allBookings = [...currentBookings, ...response.data];

          this.loadFlightsForBookings(response.data).then( () => {
            response.data.forEach(flight => this.loadedIds.add(flight.id));
            const sortedBookings = allBookings.sort((a, b) => {
              const flightA = this.flightsMap[a.flightId]?.origin || '';
              const flightB = this.flightsMap[b.flightId]?.origin || '';
              return flightA.localeCompare(flightB);
            });
            this._bookings.next(sortedBookings);
          });
          this.page++;
          notify?.complete();
        },
        error: (err) => {
          console.error('Error loading bookings:', err);
          notify?.complete();
        },
      });
  }

  private async loadFlightsForBookings(bookings: Booking[]): Promise<void> {
    const missingFlightIds = bookings
      .map((b) => b.flightId)
      .filter((fId) => fId && !this.flightsMap[fId]);
  
    if (missingFlightIds.length === 0) return;
  
    const flightRequests = missingFlightIds.map((fId) =>
      this.flightsSvc.getById(fId).pipe(
        // Atrapar errores y devolver null para vuelos fallidos
        catchError(() => of(null))
      ).toPromise()
    );
  
    try {
      const flights = await Promise.all(flightRequests);
      flights.forEach((flight) => {
        if (flight) {
          this.flightsMap[flight.id] = flight;
        }
      });
    } catch (err) {
      console.error('Error loading flights:', err);
    }
  }
  
  private loadAllFlights(): void {
    this.flightsSvc.getAll(1, 1000).subscribe({
      next: (response: Paginated<Flight>) => {
        response.data.forEach((flight) => {
          this.flightsMap[flight.id] = flight;
        });
      },
      error: (err) => console.error('Error loading all flights:', err),
    });
  }

  async addBooking(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: BookingModalComponent,
      componentProps: {
        flights: Object.values(this.flightsMap), // Pasar todos los vuelos
      },
    });
  
    await modal.present();
    const { data } = await modal.onDidDismiss();
  
    if (data) {
      this.bookingsSvc.add(data).subscribe({
        next: () => this.refreshBookings(),
        error: (err) => console.error('Error adding booking:', err),
      });
    }
  }
  
  async editBooking(booking: Booking): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: BookingModalComponent,
      componentProps: {
        booking,
        flights: Object.values(this.flightsMap), // Pasar todos los vuelos
      },
    });
  
    await modal.present();
    const { data } = await modal.onDidDismiss();
  
    if (data) {
      this.bookingsSvc.update(booking.id, data).subscribe({
        next: () => this.refreshBookings(),
        error: (err) => console.error('Error updating booking:', err),
      });
    }
  }
  

  async deleteBooking(booking: Booking): Promise<void> {
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
            this.bookingsSvc.delete(booking.id).subscribe({
              next: () => {
                this._bookings.next(
                  this._bookings.value.filter((b) => b.id !== booking.id)
                );
                this.refreshBookings();//TODO : probar llamado a refresh para que carguen bien las reservas
              },
              error: (err) => console.error('Error deleting booking:', err),
            });
          },
        },
      ],
    });

    await alert.present();
  }

  refreshBookings(): void {
    this.page = 1;
    this._bookings.next([]);
    this.loadBookings();
  }

  onIonInfinite(ev: any) {
    this.loadBookings(ev.target);
  }
}