import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Booking } from 'src/app/core/models/booking.model';
import { Flight } from 'src/app/core/models/flight.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { BookingsService } from 'src/app/core/services/impl/bookings.service';
import { FlightsService } from 'src/app/core/services/impl/flights.service';
import { BookingModalComponent } from 'src/app/shared/components/booking-modal/booking-modal.component';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  private _bookings = new BehaviorSubject<Booking[]>([]);
  bookings$: Observable<Booking[]> = this._bookings.asObservable();
  flightsMap: { [flightId: string]: Flight } = {};
  private page: number = 1;
  private readonly pageSize: number = 25;
  private loading: boolean = false;

  constructor(
    private bookingsSvc: BookingsService,
    private flightsSvc: FlightsService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(notify: HTMLIonInfiniteScrollElement | null = null): void {
    if (this.loading) return; // Evitar solicitudes múltiples simultáneamente
    this.loading = true;

    this.bookingsSvc
      .getAll(this.page, this.pageSize)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response: Paginated<Booking>) => {
          const currentBookings = this._bookings.value;
          this._bookings.next([...currentBookings, ...response.data]);
          this.page++;
          this.loadFlightsForBookings(response.data);
          notify?.complete();
        },
        error: (err) => {
          console.error('Error loading bookings:', err);
          notify?.complete();
        },
      });
  }

  private loadFlightsForBookings(bookings: Booking[]): void {
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
  
    Promise.all(flightRequests)
      .then((flights) => {
        // Filtrar valores null o undefined
        const validFlights = flights.filter((flight): flight is Flight => flight !== null && flight !== undefined);
        validFlights.forEach((flight) => {
          this.flightsMap[flight.id] = flight;
        });
      })
      .catch((err) => console.error('Error loading flights:', err));
  }
  

  async addBooking(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: BookingModalComponent,
      componentProps: {
        flights: Object.values(this.flightsMap),
      },
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      this.bookingsSvc.add(data).subscribe({
        next: (newBooking) => {
          this._bookings.next([newBooking, ...this._bookings.value]);
          this.refreshBookings();//TODO : probar llamado a refresh para que carguen bien las reservas
        },
        error: (err) => console.error('Error adding booking:', err),
      });
    }
  }

  async editBooking(booking: Booking): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: BookingModalComponent,
      componentProps: {
        booking,
        flights: Object.values(this.flightsMap),
      },
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      this.bookingsSvc.update(booking.id, data).subscribe({
        next: (updatedBooking) => {
          const updatedList = this._bookings.value.map((b) =>
            b.id === booking.id ? updatedBooking : b
          );
          this._bookings.next(updatedList);
          this.refreshBookings();//TODO : probar llamado a refresh para que carguen bien las reservas 
        },
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
