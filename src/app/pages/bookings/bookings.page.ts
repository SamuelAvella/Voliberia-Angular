import { Component, OnInit } from "@angular/core";
import { AlertController, InfiniteScrollCustomEvent, ModalController, Platform } from "@ionic/angular";
import { BehaviorSubject, catchError, forkJoin, map, Observable, of } from "rxjs";
import { Booking } from "src/app/core/models/booking.model";
import { Flight } from "src/app/core/models/flight.model";
import { Paginated } from "src/app/core/models/paginated.model";
import { UserApp } from "src/app/core/models/userApp.model";
import { BookingsService } from "src/app/core/services/impl/bookings.service";
import { FlightsService } from "src/app/core/services/impl/flights.service";
import { UsersAppService } from "src/app/core/services/impl/usersApp.service";
import { BookingModalComponent } from "src/app/shared/components/booking-modal/booking-modal.component";

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  private _bookings: BehaviorSubject<Booking[]> = new BehaviorSubject<Booking[]>([]);
  bookings$: Observable<Booking[]> = this._bookings.asObservable();
  flightsMap: { [flightId: string]: Flight } = {};
  usersMap: { [userAppId: string]: { email: string } } = {};

  page: number = 1;
  pageSize: number = 25;

  constructor(
    private bookingsSvc: BookingsService,
    private flightsSvc: FlightsService,
    private usersAppSvc: UsersAppService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private platform: Platform
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.page = 1;
    this.bookingsSvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Booking>) => {
        this._bookings.next([...response.data]);
        this.loadFlightsForBookings(response.data);
        this.loadUsersForBookings(response.data);
      },
      error: (err) => console.error('Error loading bookings:', err),
    });
  }

  private loadFlightsForBookings(bookings: Booking[]): void {
    const missingFlightIds = bookings
      .map((b) => b.flightId)
      .filter((id) => id && !this.flightsMap[id]);

    if (missingFlightIds.length === 0) return;

    forkJoin(
      missingFlightIds.map((id) =>
        this.flightsSvc.getById(id).pipe(
          catchError((err) => {
            console.error(`Error fetching flight with ID ${id}:`, err);
            return of(null);
          })
        )
      )
    ).subscribe({
      next: (flights) => {
        flights.filter((flight): flight is Flight => !!flight).forEach((flight) => {
          this.flightsMap[flight.id] = flight;
        });
      },
    });
  }

  private loadUsersForBookings(bookings: Booking[]): void {
    const missingUserIds = bookings
      .map((b) => b.userAppId)
      .filter((id) => id && !this.usersMap[id]);
  
    if (missingUserIds.length === 0) return;
  
    forkJoin(
      missingUserIds.map((id) =>
        this.usersAppSvc.getById(id).pipe(
          catchError((err) => {
            console.error(`Error fetching user with ID ${id}:`, err);
            return of(null); // En caso de error, devolvemos null
          })
        )
      )
    ).subscribe({
      next: (users) => {
        users
          .filter((user): user is UserApp => user !== null) // Aseguramos que no haya nulos
          .forEach((user) => {
            // Mapeamos solo las propiedades necesarias
            this.usersMap[user.id] = { email: user.email || 'Unknown' };
          });
      },
      error: (err) => console.error('Error loading users:', err),
    });
  }
  

  async onAddBooking(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: BookingModalComponent,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.bookingsSvc.add(result.data).subscribe(() => this.loadBookings());
      }
    });

    await modal.present();
  }

  async onEditBooking(booking: Booking): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: BookingModalComponent,
      componentProps: { booking },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.bookingsSvc.update(booking.id, result.data).subscribe(() => this.loadBookings());
      }
    });

    await modal.present();
  }

  async onDeleteBooking(booking: Booking): Promise<void> {
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
            this.bookingsSvc.delete(booking.id).subscribe(() => this.loadBookings());
          },
        },
      ],
    });

    await alert.present();
  }

  onIonInfinite(event: InfiniteScrollCustomEvent): void {
    this.bookingsSvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Booking>) => {
        this._bookings.next([...this._bookings.value, ...response.data]);
        event.target.complete();
      },
      error: () => event.target.complete(),
    });
  }
}
