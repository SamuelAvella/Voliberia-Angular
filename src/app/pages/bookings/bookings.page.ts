import { Component, OnInit } from "@angular/core";
import { InfiniteScrollCustomEvent, Platform } from "@ionic/angular";
import { BehaviorSubject, catchError, forkJoin, map, Observable, of } from "rxjs";
import { Booking } from "src/app/core/models/booking.model";
import { Flight } from "src/app/core/models/flight.model";
import { Paginated } from "src/app/core/models/paginated.model";
import { BookingsService } from "src/app/core/services/impl/bookings.service";
import { FlightsService } from "src/app/core/services/impl/flights.service";

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  private _bookings: BehaviorSubject<Booking[]> = new BehaviorSubject<Booking[]>([]);
  bookings$: Observable<Booking[]> = this._bookings.asObservable();
  flightsMap: { [flightId: string]: Flight } = {};

  page: number = 1;
  pageSize: number = 25;
  pages: number = 0;
  isWeb: boolean = false;

  constructor(
    private bookingsSvc: BookingsService,
    private flightsSvc: FlightsService,
    private platform: Platform
  ) {
    this.isWeb = this.platform.is('desktop');
  }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.page = 1;
    this.bookingsSvc.getAll(this.page, this.pageSize).subscribe({
      next: async (response: Paginated<Booking>) => {
        this._bookings.next([...response.data]);
        this.page++;
        this.pages = response.pages;

        // Cargar información de vuelos para las reservas obtenidas
        this.loadFlightsForBookings(response.data);
      },
      error: (err) => console.error('Error loading bookings:', err),
    });
  }

  loadMoreBookings(event: InfiniteScrollCustomEvent): void {
    if (this.page <= this.pages) {
      this.bookingsSvc.getAll(this.page, this.pageSize).subscribe({
        next: (response: Paginated<Booking>) => {
          this._bookings.next([...this._bookings.value, ...response.data]);
          this.page++;
          this.loadFlightsForBookings(response.data);
          event.target.complete();
        },
        error: (err) => {
          console.error('Error loading more bookings:', err);
          event.target.complete();
        },
      });
    } else {
      event.target.complete();
    }
  }

  private loadFlightsForBookings(bookings: Booking[]): void {
    const missingFlightIds = bookings
        .map((b) => b.flightId)
        .filter((fId) => fId && !this.flightsMap[fId]);

    if (missingFlightIds.length === 0) return;

    const flightRequests: Observable<Flight | null>[] = missingFlightIds.map((fId) =>
        this.flightsSvc.getById(fId).pipe(
            catchError((err) => {
                console.error(`Error fetching flight with ID ${fId}:`, err);
                return of(null); // Aquí se usa of(null) en lugar de null
            })
        )
    );

    forkJoin(flightRequests)
        .pipe(
            map((flights) => flights.filter((flight): flight is Flight => !!flight))
        )
        .subscribe({
            next: (flights: Flight[]) => {
                flights.forEach((flight) => {
                    this.flightsMap[flight.id] = flight;
                });
            },
            error: (err) => console.error('Error loading flights:', err),
        });
}

  onIonInfinite(event: InfiniteScrollCustomEvent): void {
    this.loadMoreBookings(event);
  }

  onBookingStateChange(booking: Booking): void {
    const updatedBooking: Booking = {
      ...booking,
      bookingState: !booking.bookingState,
    };

    this.bookingsSvc.update(booking.id, updatedBooking).subscribe({
      next: () => {
        const updatedList = this._bookings.value.map((b) =>
          b.id === booking.id ? { ...b, bookingState: updatedBooking.bookingState } : b
        );
        this._bookings.next(updatedList);
      },
      error: (err) => console.error('Error updating booking state:', err),
    });
  }
}