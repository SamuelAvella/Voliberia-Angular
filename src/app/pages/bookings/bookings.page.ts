import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable, lastValueFrom, forkJoin } from 'rxjs';
import { Paginated } from 'src/app/core/models/paginated.model';
import { Booking } from 'src/app/core/models/booking.model';
import { BookingsService } from 'src/app/core/services/impl/bookings.service';
import { FlightsService } from 'src/app/core/services/impl/flights.service';
import { Flight } from 'src/app/core/models/flight.model';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  
  private _bookings: BehaviorSubject<Booking[]> = new BehaviorSubject<Booking[]>([]);
  bookings$: Observable<Booking[]> = this._bookings.asObservable();

  // Mapa para almacenar la info de vuelos por flightId
  flightsMap: { [flightId: string]: Flight } = {};

  page: number = 1;
  pageSize: number = 25;
  pages: number = 0;
  isWeb: boolean = false;

  constructor(
    private bookingsSvc: BookingsService,
    private flightSvc: FlightsService,
    private platform: Platform
  ) {
    // Detecta si se está en plataforma desktop (opcional, como en PeoplePage)
    this.isWeb = this.platform.is('desktop');
  }

  ngOnInit(): void {
    this.loadBookings();
  }

  async loadBookings() {
    this.page = 1;
    const response: Paginated<Booking> = await lastValueFrom(this.bookingsSvc.getAll(this.page, this.pageSize));
    this._bookings.next([...response.data]);
    this.page++;
    this.pages = response.pages;

    // Cargar info de vuelos para las reservas obtenidas
    await this.loadFlightsForBookings(response.data);
  }

  async loadMoreBookings(notify: HTMLIonInfiniteScrollElement | null = null) {
    if (this.page <= this.pages) {
      const response: Paginated<Booking> = await lastValueFrom(this.bookingsSvc.getAll(this.page, this.pageSize));
      this._bookings.next([...this._bookings.value, ...response.data]);
      this.page++;
      notify?.complete();

      // Cargar info de vuelos para las nuevas reservas
      await this.loadFlightsForBookings(response.data);
    } else {
      notify?.complete();
    }
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.loadMoreBookings(ev.target);
  }

  // Método para invertir el estado de la reserva
  onBookingStateChange(booking: Booking) {
    const updatedBooking: Booking = {
      ...booking,
      bookingState: !booking.bookingState
    };

    this.bookingsSvc.update(booking.id, updatedBooking).subscribe({
      next: () => {
        const updatedList = this._bookings.value.map(b =>
          b.id === booking.id ? { ...b, bookingState: updatedBooking.bookingState } : b
        );
        this._bookings.next(updatedList);
      },
      error: err => {
        console.error("Error actualizando booking", err);
      }
    });
  }

  private async loadFlightsForBookings(bookings: Booking[]): Promise<void> {
    // Filtramos aquellos flightId de los que aún no hemos obtenido el vuelo
    const missingFlightIds = bookings
      .map(b => b.flightId)
      .filter(fId => !this.flightsMap[fId]);

    if (missingFlightIds.length === 0) {
      return;
    }

    // Aquí en lugar de getOne, usamos getById, que devuelve Observable<Flight | null>
    const flightCalls = missingFlightIds.map(fId => this.flightSvc.getById(fId));

    // Esperamos a que se resuelvan todas las llamadas
    const flights = await lastValueFrom(forkJoin(flightCalls));

    flights.forEach((flight, index) => {
      const fId = missingFlightIds[index];
      if (flight) { // Si no es null, almacenamos el vuelo
        this.flightsMap[fId] = flight;
      }
    });
  }

}
