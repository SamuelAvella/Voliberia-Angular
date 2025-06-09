import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

import { Flight } from 'src/app/core/models/flight.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { CalendarEvent } from 'angular-calendar';
import { DatetimeChangeEventDetail } from '@ionic/angular';
import { IonDatetimeCustomEvent } from '@ionic/core';

import { FLIGHTS_COLLECTION_SUBSCRIPTION_TOKEN } from 'src/app/core/repositories/repository.token';
import { CollectionChange, ICollectionSubscription } from 'src/app/core/services/interfaces/collection-subscription.interface';
import { FlightsService } from 'src/app/core/services/impl/flights.service';
import { BookingsService } from 'src/app/core/services/impl/bookings.service';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { UsersAppService } from 'src/app/core/services/impl/usersApp.service';
import { Booking, BookingState } from 'src/app/core/models/booking.model';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {
  // 🛫 Vuelos y paginación
  private _flights = new BehaviorSubject<Flight[]>([]);
  flights$: Observable<Flight[]> = this._flights.asObservable();
  private loadedIds: Set<string> = new Set();
  private page = 1;
  private pageSize = 25;
  allFlights: Flight[] = [];

  // 🌍 Localización
  currentLocale: string;

  // 📌 Selección
  selectedOrigin: string | null = null;
  selectedDestination: string | null = null;
  selectedDate: string | null = null;

  // 🧠 Orígenes y destinos únicos y filtrados
  uniqueOrigins: string[] = [];
  uniqueDestinations: string[] = [];
  filteredOrigins: string[] = [];
  filteredDestinations: string[] = [];
  searchOrigin = '';
  searchDestination = '';
  filteredOriginsSearch: string[] = [];
  filteredDestinationsSearch: string[] = [];

  // ⚙️ Toggles de inputs
  toggleOriginSelector = false;
  toggleDestinationSelector = false;
  toggleDateSelector = false;

  // 📅 Fechas válidas
  minSelectableDate: string = '';
  maxSelectableDate: string = '';
  disabledDates: string[] = [];

  // 🧩 ViewChilds para cerrar selectores al hacer clic fuera
  @ViewChild('originWrapper') originWrapper!: ElementRef;
  @ViewChild('originInput') originInput!: ElementRef<HTMLInputElement>;
  @ViewChild('destinationWrapper') destinationWrapper!: ElementRef;
  @ViewChild('destinationInput') destinationInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dateWrapper') dateWrapper!: ElementRef;

  // 📆 Eventos de prueba (calendario)
  viewDate: Date = new Date();
  events: CalendarEvent[] = [
    { start: new Date(), title: 'Hoy', allDay: true },
    {
      start: new Date(new Date().setDate(new Date().getDate() + 1)),
      title: 'Evento mañana',
      allDay: true,
    },
  ];

  // 📸 Swiper: destinos destacados
  destinationImages = [
    { name: 'Barcelona (BCN)', image: 'assets/img/destinations/barcelona.jpg' },
    { name: 'Lisboa (LIS)', image: 'assets/img/destinations/lisboa.jpg' },
    { name: 'Madrid (MAD)', image: 'assets/img/destinations/madrid.jpg' },
    { name: 'Malaga (AGP)', image: 'assets/img/destinations/malaga.jpg' },
    { name: 'Palma (PMI)', image: 'assets/img/destinations/palma.jpg' },
    { name: 'Porto (POR)', image: 'assets/img/destinations/porto.jpg' },
  ];

  constructor(
    private flightsSvc: FlightsService,
    private translateService: TranslateService,
    private bookingsSvc: BookingsService,
    private authService: BaseAuthenticationService,
    private usersAppService: UsersAppService,
    private router: Router,
    @Inject(FLIGHTS_COLLECTION_SUBSCRIPTION_TOKEN)
    private flightsSubscription: ICollectionSubscription<Flight>
  ) {
    this.currentLocale = this.translateService.currentLang || 'en-US';
    this.translateService.onLangChange.subscribe(
      (event) => (this.currentLocale = event.lang)
    );
  }

  ngOnInit(): void {
    this.getAllFlights();
    this.flights$.subscribe((flights) => {
      this.allFlights = flights;
      console.log('[flights$] 🛬 Todos los vuelos recibidos:', flights);

      this.uniqueOrigins = [...new Set(flights.map((f) => f.origin))].sort();
      console.log('[flights$] 🌍 Orígenes únicos:', this.uniqueOrigins);

      this.uniqueDestinations = [...new Set(flights.map((f) => f.destination))].sort();
      console.log('[flights$] 🏁 Destinos únicos:', this.uniqueDestinations);

      this.filteredOrigins = [...this.uniqueOrigins];
      console.log('[flights$] 🎯 Orígenes filtrados iniciales:', this.filteredOrigins);

      this.filteredDestinations = [...this.uniqueDestinations];
      console.log('[flights$] 🎯 Destinos filtrados iniciales:', this.filteredDestinations);

      this.filteredOriginsSearch = [...this.filteredOrigins];
      this.filteredDestinationsSearch = [...this.filteredDestinations];
    });
  }

  // 📥 Carga de vuelos
  getAllFlights(notify: HTMLIonInfiniteScrollElement | null = null): void {
    this.flightsSvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Flight>) => {
        response.data.forEach((f) => this.loadedIds.add(f.id));
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

  onIonInfinite(ev: any): void {
    this.getAllFlights(ev.target);
  }

  // 🎯 Filtros
  filterOrigins(): void {
    this.filteredOrigins = this.selectedDestination
      ? [...new Set(this.allFlights.filter(f => f.destination === this.selectedDestination).map(f => f.origin))].sort()
      : [...this.uniqueOrigins];
    if (this.selectedOrigin && !this.filteredOrigins.includes(this.selectedOrigin)) {
      this.selectedOrigin = null;
      this.filterDestinations();
    }
  }

  filterDestinations(): void {
    this.filteredDestinations = this.selectedOrigin
      ? [...new Set(this.allFlights.filter(f => f.origin === this.selectedOrigin).map(f => f.destination))].sort()
      : [...this.uniqueDestinations];
    if (this.selectedDestination && !this.filteredDestinations.includes(this.selectedDestination)) {
      this.selectedDestination = null;
      this.filterOrigins();
    }
  }

  resetFilters(): void {
    this.selectedOrigin = null;
    this.selectedDestination = null;
    this.filteredOrigins = [...this.uniqueOrigins];
    this.filteredDestinations = [...this.uniqueDestinations];
  }

  // ✈️ Origen
  openOriginSelector(event: Event): void {
    event.stopPropagation();
    this.toggleOriginSelector = true;
    this.toggleDestinationSelector = false;
    this.toggleDateSelector = false;
    this.searchOrigin = '';
    this.filteredOriginsSearch = [...this.filteredOrigins];
    setTimeout(() => this.originInput?.nativeElement.focus(), 0);
  }

  selectOrigin(origin: string): void {
    this.selectedOrigin = origin;
    this.toggleOriginSelector = false;
    this.filterDestinations();
    this.updateAvailableDates();
  }

  filterOriginsSearch(): void {
    const term = this.searchOrigin.toLowerCase();
    this.filteredOriginsSearch = this.filteredOrigins.filter((o) => o.toLowerCase().includes(term));
  }

  clearOriginSelection(event: Event): void {
    event.stopPropagation();
    this.selectedOrigin = null;
    this.searchOrigin = '';
    this.filteredOriginsSearch = [...this.filteredOrigins];
    this.filterDestinations();
  }

  // 🛬 Destino
  openDestinationSelector(event: Event): void {
    event.stopPropagation();
    this.toggleDestinationSelector = true;
    this.toggleOriginSelector = false;
    this.toggleDateSelector = false;
    this.searchDestination = '';
    this.filteredDestinationsSearch = [...this.filteredDestinations];
    setTimeout(() => this.destinationInput?.nativeElement.focus(), 0);
  }

  selectDestination(destination: string): void {
    this.selectedDestination = destination;
    this.toggleDestinationSelector = false;
    this.filterOrigins();
    this.updateAvailableDates();
  }

  filterDestinationsSearch(): void {
    const term = this.searchDestination.toLowerCase();
    this.filteredDestinationsSearch = this.filteredDestinations.filter((d) =>
      d.toLowerCase().includes(term)
    );
  }

  clearDestinationSelection(event: Event): void {
    event.stopPropagation();
    this.selectedDestination = null;
    this.searchDestination = '';
    this.filteredDestinationsSearch = [...this.filteredDestinations];
    this.filterOrigins();
  }

  // 📅 Fechas
  openDateSelector(event: Event): void {
    event.stopPropagation();
    this.toggleDateSelector = true;
    this.toggleOriginSelector = false;
    this.toggleDestinationSelector = false;
  }

  onDateSelected(event: CustomEvent): void {
    this.selectedDate = event.detail.value as string;
    this.toggleDateSelector = false;
  }

  clearDateSelection(event: Event): void {
    event.stopPropagation();
    this.selectedDate = null;
    this.toggleDateSelector = false;
  }

  updateAvailableDates(): void {
    if (!this.selectedOrigin || !this.selectedDestination) return;
    const matching = this.allFlights.filter(
      (f) => f.origin === this.selectedOrigin && f.destination === this.selectedDestination
    );
    const dates = [...new Set(matching.map((f) => f.departureDate.split('T')[0]))].sort();
    this.minSelectableDate = dates[0] ?? '';
    this.maxSelectableDate = dates.length > 0 ? dates[dates.length - 1] : '';
    this.disabledDates = this.getDisabledDatesInRange(this.minSelectableDate, this.maxSelectableDate, dates);
    this.selectedDate = null;
  }

  getDisabledDatesInRange(min: string, max: string, allowed: string[]): string[] {
    const disabled: string[] = [];
    const current = new Date(min);
    const end = new Date(max);
    while (current <= end) {
      const iso = current.toISOString().split('T')[0];
      if (!allowed.includes(iso)) disabled.push(iso);
      current.setDate(current.getDate() + 1);
    }
    return disabled;
  }

  isFlightDate = (dateIsoString: string): boolean => {
    const dateOnly = dateIsoString.split('T')[0];
    return this.allFlights.some(
      (f) =>
        f.origin === this.selectedOrigin &&
        f.destination === this.selectedDestination &&
        f.departureDate.split('T')[0] === dateOnly
    );
  };

  // 📸 Swiper
  selectDestinationFromImage(destinationName: string): void {
    this.selectedDestination = destinationName;
    this.filterOrigins();
    this.updateAvailableDates();
  }

  // 📤 Cierre de dropdowns
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const path = event.composedPath();
    if (this.toggleOriginSelector && !path.includes(this.originWrapper.nativeElement))
      this.toggleOriginSelector = false;
    if (this.toggleDestinationSelector && !path.includes(this.destinationWrapper.nativeElement))
      this.toggleDestinationSelector = false;
    if (this.toggleDateSelector && !path.includes(this.dateWrapper.nativeElement))
      this.toggleDateSelector = false;
  }

  // ✅ Crear reserva
  async createBooking(): Promise<void> {
  try {
    if (!this.selectedDate) {
      console.error('[createBooking] ❌ No hay fecha seleccionada');
      return;
    }

    const selectedDateFormatted = this.selectedDate.split('T')[0];
    const selectedFlight = this.allFlights.find(
      f =>
        f.origin === this.selectedOrigin &&
        f.destination === this.selectedDestination &&
        f.departureDate.split('T')[0] === selectedDateFormatted
    );

    if (!selectedFlight) {
      console.error('[createBooking] ❌ No se encontró vuelo');
      return;
    }

    console.log('[createBooking] ✅ Vuelo encontrado:', selectedFlight);

    const user = await this.authService.getCurrentUser();
    if (!user) {
      console.error('[createBooking] ❌ Usuario no logueado');
      return;
    }

    const userApp = await firstValueFrom(this.usersAppService.getByUserId(user.id));
    if (!userApp) {
      console.error('[createBooking] ❌ No se encontró userApp');
      return;
    }

    const booking: Booking = {
      id: '',
      bookingState: 'pending',
      flightId: selectedFlight.id,
      userAppId: userApp.id
    };

    console.log('[createBooking] 🔄 Datos a enviar:', booking);

    const created = await firstValueFrom(this.bookingsSvc.add(booking));

    console.log('[createBooking] ✅ Reserva creada:', created);


    alert('Reserva realizada con éxito');
    this.router.navigate(['/bookings']);
  } catch (error) {
    console.error('[createBooking] ❌ Error:', error);
    alert('Error al crear la reserva');
  }
}


}
