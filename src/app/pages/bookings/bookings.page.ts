/**
 * Página que muestra las reservas realizadas por el usuario autenticado.
 * Permite paginar, cancelar reservas, y ver los vuelos asociados.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, firstValueFrom, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { Booking } from 'src/app/core/models/booking.model';
import { Flight } from 'src/app/core/models/flight.model';
import { Paginated } from 'src/app/core/models/paginated.model';

import { BOOKINGS_COLLECTION_SUBSCRIPTION_TOKEN, FLIGHTS_COLLECTION_SUBSCRIPTION_TOKEN } from 'src/app/core/repositories/repository.token';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { BookingsService } from 'src/app/core/services/impl/bookings.service';
import { FlightsService } from 'src/app/core/services/impl/flights.service';
import { UsersAppService } from 'src/app/core/services/impl/usersApp.service';
import { CollectionChange, ICollectionSubscription } from 'src/app/core/services/interfaces/collection-subscription.interface';
import { BookingModalComponent } from 'src/app/shared/components/booking-modal/booking-modal.component';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  
  /** Stream de reservas */
  private _bookings = new BehaviorSubject<Booking[]>([]);
  bookings$: Observable<Booking[]> = this._bookings.asObservable();

  /** Stream de vuelos */
  private _flights = new BehaviorSubject<Flight[]>([]);
  flights$: Observable<Flight[]> = this._flights.asObservable();
  
  /** Mapa de ID de vuelo a objeto `Flight` */
  flightsMap: { [flightId: string]: Flight } = {};

  /** IDs de reservas ya cargadas */
  private loadedIds: Set<string> = new Set();

  private page = 1;
  private readonly pageSize = 25;
  private loading = false;

  /** Idioma actual */
  currentLocale: string;
  
  /** Fecha actual */
  now: Date = new Date();

  /** Fecha seleccionada en la vista */
  selectedDate: string | null = null;

  /** Hora seleccionada en la vista */
  selectedTime: string | null = null;

  /** Fechas con vuelos disponibles agrupadas */
  flightsByDate: Map<string, string[]> = new Map();

  constructor(
    private bookingsSvc: BookingsService,
    private flightsSvc: FlightsService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private translateService: TranslateService,
    private authService: BaseAuthenticationService,
    private usersAppSvc: UsersAppService,

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

  ionViewWillEnter(): void {
    const navigation = window.history.state;
    
    if (navigation?.reload) {
      console.log('Recargando reservas por navegación desde BookPage');
      
      this.page = 1;
      this._bookings.next([]);
      this.loadedIds.clear();
      this.loadAllFlights();
      this.loadBookings();
    }
  }
  
  /**
   * Inicializa la página: carga vuelos y reservas, y se suscribe a cambios en tiempo real.
   */
  ngOnInit(): void {
    this.loadAllFlights();
    this.loadBookings();

    this.bookingsSubscription.subscribe('bookings').subscribe((change: CollectionChange<Booking>) => {
      const current = [...this._bookings.value];
      if (!this.loadedIds.has(change.id) && change.type !== 'added') return;

      const index = current.findIndex(b => b.id === change.id);
      switch (change.type) {
        case 'added':
        case 'modified':
          if (index >= 0) current[index] = change.data!;
          break;
        case 'removed':
          if (index >= 0) {
            current.splice(index, 1);
            this.loadedIds.delete(change.id);
          }
          break;
      }
      this._bookings.next(current);
    });

    this.flightsSubscription.subscribe('flights').subscribe((change: CollectionChange<Flight>) => {
      const current = [...this._flights.value];
      if (!this.loadedIds.has(change.id) && change.type !== 'added') return;

      const index = current.findIndex(f => f.id === change.id);
      switch (change.type) {
        case 'added':
        case 'modified':
          if (index >= 0) current[index] = change.data!;
          break;
        case 'removed':
          if (index >= 0) {
            current.splice(index, 1);
            this.loadedIds.delete(change.id);
          }
          break;
      }
      this._flights.next(current);
    });
  }

  /**
   * Carga todas las reservas del usuario actual y las ordena por fecha descendente.
   */
  async loadBookings(notify: HTMLIonInfiniteScrollElement | null = null): Promise<void> {
    if (this.loading) return;
    this.loading = true;

    try {
      const user = await this.authService.getCurrentUser();
      const userApp = await firstValueFrom(this.usersAppSvc.getByUserId(user.id));
      if (!userApp) throw new Error('No se encontró userApp');

      this.bookingsSvc.getAll(this.page, this.pageSize).pipe(
        finalize(() => {
          this.loading = false;
          notify?.complete();
        })
      ).subscribe({
        next: async (response: Paginated<Booking>) => {
          const myBookings = response.data.filter(b => b.userAppId === userApp.id);
          myBookings.forEach(b => this.loadedIds.add(b.id));

          const allBookings = [...this._bookings.value, ...myBookings];
          await this.loadFlightsForBookings(myBookings);

          const sorted = allBookings.sort((b, a) =>
            new Date(this.flightsMap[a.flightId]?.departureDate || 0).getTime() -
            new Date(this.flightsMap[b.flightId]?.departureDate || 0).getTime()
          );

          this._bookings.next(sorted);
          this.page++;
        },
        error: err => console.error('Error loading bookings:', err),
      });
    } catch (err) {
      console.error('Error obteniendo usuario o userApp:', err);
      this.loading = false;
      notify?.complete();
    }
  }

  /**
   * Carga los vuelos asociados a las reservas si no están en cache.
   */
  private async loadFlightsForBookings(bookings: Booking[]): Promise<void> {
    const missingFlightIds = bookings.map(b => b.flightId).filter(fId => !this.flightsMap[fId]);
    if (missingFlightIds.length === 0) return;

    const flightRequests = missingFlightIds.map(fId =>
      this.flightsSvc.getById(fId).pipe(catchError(() => of(null))).toPromise()
    );

    const flights = await Promise.all(flightRequests);
    flights.forEach(flight => {
      if (flight) this.flightsMap[flight.id] = flight;
    });
  }

  /**
   * Carga todos los vuelos para visualización general.
   */
  private loadAllFlights(): void {
    this.flightsSvc.getAll(1, 1000).subscribe({
      next: (response: Paginated<Flight>) => {
        response.data.forEach(flight => this.flightsMap[flight.id] = flight);
        this._flights.next(response.data);
        this.prepareFlightDates();

      },
      error: err => console.error('Error loading all flights:', err),
    });
  }

  /**
   * Vuelve a cargar las reservas desde la primera página.
   */
  refreshBookings(): void {
    this.page = 1;
    this._bookings.next([]);
    this.loadBookings();
  }

  /**
   * Llama a la carga de más reservas al hacer scroll infinito.
   */
  onIonInfinite(ev: any): void {
    this.loadBookings(ev.target);
  }

  /**
   * Cancela una reserva seleccionada tras confirmación.
   * @param booking Reserva a cancelar
   */
  async cancelBooking(booking: Booking): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: this.translateService.instant('BOOKING.CANCEL_TITLE'),
      message: this.translateService.instant('BOOKING.CANCEL_CONFIRM'),
      buttons: [
        {
          text: this.translateService.instant('COMMON.NO'),
          role: 'cancel'
        },
        {
          text: this.translateService.instant('COMMON.YES'),
          role: 'confirm',
          handler: () => {
            const updated: Booking = {
              ...booking,
              bookingState: 'cancelled'
            };

            this.bookingsSvc.update(booking.id, updated).subscribe({
              next: () => this.refreshBookings(),
              error: err => console.error('Error al cancelar la reserva:', err),
            });
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Agrupa las fechas de salida de vuelos para mostrarlas en el calendario.
   */
  prepareFlightDates(): void {
    this.flightsByDate.clear();

    const allFlights = Object.values(this.flightsMap);

    allFlights.forEach(flight => {
      const [date, time] = flight.departureDate.split('T');
      if (!this.flightsByDate.has(date)) {
        this.flightsByDate.set(date, []);
      }
      this.flightsByDate.get(date)!.push(time.slice(0, 5)); // HH:mm
    });

    console.log('🧭 Fechas de vuelos agrupadas:', this.flightsByDate);
  }

  /**
   * Determina si una fecha tiene vuelos disponibles.
   */
  isFlightDate = (dateIsoString: string): boolean => {
    const dateOnly = dateIsoString.split('T')[0];
    return this.flightsByDate.has(dateOnly);
  };

  /**
   * Maneja la selección de fecha en el calendario.
   */
  onDateSelected(event: CustomEvent): void {
    const isoDate = event.detail.value as string;
    this.selectedDate = isoDate.split('T')[0];
    this.selectedTime = null;
    console.log('📅 Día seleccionado:', this.selectedDate);
  }

  /**
   * Asigna una hora seleccionada en el calendario.
   */
  selectTime(time: string): void {
    this.selectedTime = time;
    const fullDateTime = `${this.selectedDate}T${time}:00`;
    console.log('✅ Fecha completa seleccionada:', fullDateTime);
  }
}