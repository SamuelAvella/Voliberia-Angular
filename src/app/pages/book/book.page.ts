import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Observable, firstValueFrom } from "rxjs";
import { Flight } from "src/app/core/models/flight.model";
import { Paginated } from "src/app/core/models/paginated.model";
import { FlightsService } from "src/app/core/services/impl/flights.service";
import { CollectionChange, ICollectionSubscription } from "src/app/core/services/interfaces/collection-subscription.interface";
import { FLIGHTS_COLLECTION_SUBSCRIPTION_TOKEN } from "src/app/core/repositories/repository.token";
import { DatetimeChangeEventDetail } from "@ionic/angular";
import { IonDatetimeCustomEvent } from "@ionic/core";
import { CalendarEvent } from "angular-calendar";
import { BookingsService } from "src/app/core/services/impl/bookings.service";
import { BaseAuthenticationService } from "src/app/core/services/impl/base-authentication.service";
import { UsersAppService } from "src/app/core/services/impl/usersApp.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {
onDateChange($event: IonDatetimeCustomEvent<DatetimeChangeEventDetail>) {
throw new Error('Method not implemented.');
}

  private _flights = new BehaviorSubject<Flight[]>([]);
  flights$: Observable<Flight[]> = this._flights.asObservable();
  private loadedIds: Set<string> = new Set();
  private page = 1;
  private pageSize = 25;

  allFlights: Flight[] = [];
  currentLocale: string;

  selectedOrigin: string | null = null;
  selectedDestination: string | null = null;

  uniqueOrigins: string[] = [];
  uniqueDestinations: string[] = [];

  filteredOrigins: string[] = [];
  filteredDestinations: string[] = [];


  toggleOriginSelector = false;
  searchOrigin = "";
  filteredOriginsSearch: string[] = [];

  @ViewChild("originWrapper") originWrapper!: ElementRef;
  @ViewChild("originInput") originInput!: ElementRef<HTMLInputElement>;


  toggleDestinationSelector = false;
  searchDestination = "";
  filteredDestinationsSearch: string[] = [];

  @ViewChild("destinationWrapper") destinationWrapper!: ElementRef;
  @ViewChild("destinationInput") destinationInput!: ElementRef<HTMLInputElement>;

  @ViewChild("dateWrapper") dateWrapper!: ElementRef;



  viewDate: Date = new Date();
  events: CalendarEvent[] = [
    {
      start: new Date(),
      title: 'Hoy',
      allDay: true
    },
    {
      start: new Date(new Date().setDate(new Date().getDate() + 1)),
      title: 'Evento mañana',
      allDay: true
    }
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
    this.currentLocale = this.translateService.currentLang || "en-US";
    this.translateService.onLangChange.subscribe((event) => {
      this.currentLocale = event.lang;
    });
  }


  ngOnInit(): void {
    this.getAllFlights();

    this.flights$.subscribe((flights) => {
      this.allFlights = flights;

      this.uniqueOrigins = [...new Set(flights.map((f) => f.origin))].sort();
      this.uniqueDestinations = [...new Set(flights.map((f) => f.destination))].sort();

      this.filteredOrigins = [...this.uniqueOrigins];
      this.filteredDestinations = [...this.uniqueDestinations];

      this.filteredOriginsSearch = [...this.filteredOrigins];
      this.filteredDestinationsSearch = [...this.filteredDestinations];
    });
  }


  getAllFlights(notify: HTMLIonInfiniteScrollElement | null = null): void {
    this.flightsSvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Flight>) => {
        response.data.forEach((f) => this.loadedIds.add(f.id));
        this._flights.next([...this._flights.value, ...response.data]);
        this.page++;
        notify?.complete();
      },
      error: (err) => {
        console.error("Error cargando vuelos:", err);
        notify?.complete();
      },
    });
  }


  filterOrigins(): void {
    if (!this.selectedDestination) {
      this.filteredOrigins = [...this.uniqueOrigins];
    } else {
      const matching = this.allFlights.filter(
        (f) => f.destination === this.selectedDestination
      );
      this.filteredOrigins = [...new Set(matching.map((f) => f.origin))].sort();
    }

    if (
      this.selectedOrigin &&
      !this.filteredOrigins.includes(this.selectedOrigin)
    ) {
      this.selectedOrigin = null;
      this.filterDestinations();
    }
  }

  filterDestinations(): void {
    if (!this.selectedOrigin) {
      this.filteredDestinations = [...this.uniqueDestinations];
    } else {
      const matching = this.allFlights.filter(
        (f) => f.origin === this.selectedOrigin
      );
      this.filteredDestinations = [...new Set(matching.map((f) => f.destination))].sort();
    }

    if (
      this.selectedDestination &&
      !this.filteredDestinations.includes(this.selectedDestination)
    ) {
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


  openOriginSelector(event: Event): void {
    event.stopPropagation();
    this.toggleOriginSelector = true;
    this.toggleDestinationSelector = false;
    this.toggleDateSelector = false;
    this.searchOrigin = "";
    this.filteredOriginsSearch = [...this.filteredOrigins];
    setTimeout(() => this.originInput?.nativeElement.focus(), 0);
  }

  selectOrigin(origin: string): void {
    this.selectedOrigin = origin;
    this.toggleOriginSelector = false;
    this.filterDestinations();
    this.updateAvailableDates(); // 👈 Añadir
  }

  filterOriginsSearch(): void {
    const term = this.searchOrigin.toLowerCase();
    this.filteredOriginsSearch = this.filteredOrigins.filter((origin) =>
      origin.toLowerCase().includes(term)
    );
  }

  clearOriginSelection(event: Event): void {
    event.stopPropagation();
    this.selectedOrigin = null;
    this.searchOrigin = "";
    this.filteredOriginsSearch = [...this.filteredOrigins];
    this.filterDestinations();
  }


  openDestinationSelector(event: Event): void {
    event.stopPropagation();
    this.toggleDestinationSelector = true;
    this.toggleOriginSelector = false;
    this.toggleDateSelector = false;
    this.searchDestination = "";
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
    this.filteredDestinationsSearch = this.filteredDestinations.filter((dest) =>
      dest.toLowerCase().includes(term)
    );
  }

  clearDestinationSelection(event: Event): void {
    event.stopPropagation();
    this.selectedDestination = null;
    this.searchDestination = "";
    this.filteredDestinationsSearch = [...this.filteredDestinations];
    this.filterOrigins();
  }


  @HostListener("document:click", ["$event"])
  onClickOutside(event: MouseEvent): void {
    const path = event.composedPath();
    if (
      this.toggleOriginSelector &&
      this.originWrapper &&
      !path.includes(this.originWrapper.nativeElement)
    ) {
      this.toggleOriginSelector = false;
    }

    if (
      this.toggleDestinationSelector &&
      this.destinationWrapper &&
      !path.includes(this.destinationWrapper.nativeElement)
    ) {
      this.toggleDestinationSelector = false;
    }

    if (
      this.toggleDateSelector &&
      this.dateWrapper &&
      !path.includes(this.dateWrapper.nativeElement)
    ) {
      this.toggleDateSelector = false;
    }

  }


  onIonInfinite(ev: any): void {
    this.getAllFlights(ev.target);
  }

  selectedDate: string | null = null;
minSelectableDate: string = '';
maxSelectableDate: string = '';
disabledDates: string[] = [];

updateAvailableDates(): void {
  if (!this.selectedOrigin || !this.selectedDestination) return;

  const matchingFlights = this.allFlights.filter(f =>
    f.origin === this.selectedOrigin && f.destination === this.selectedDestination
  );

  const allDates = matchingFlights.map(f => f.departureDate.split('T')[0]);
  const uniqueDates = [...new Set(allDates)].sort();

  if (uniqueDates.length > 0) {
    this.minSelectableDate = uniqueDates[0];
    this.maxSelectableDate = uniqueDates[uniqueDates.length - 1];
    this.disabledDates = this.getDisabledDatesInRange(this.minSelectableDate, this.maxSelectableDate, uniqueDates);
  } else {
    this.minSelectableDate = '';
    this.maxSelectableDate = '';
    this.disabledDates = [];
  }

  this.selectedDate = null;
}

getDisabledDatesInRange(min: string, max: string, allowed: string[]): string[] {
  const disabled: string[] = [];
  const current = new Date(min);
  const end = new Date(max);

  while (current <= end) {
    const iso = current.toISOString().split('T')[0];
    if (!allowed.includes(iso)) {
      disabled.push(iso);
    }
    current.setDate(current.getDate() + 1);
  }

  return disabled;
}


isFlightDate = (dateIsoString: string): boolean => {
  if (!this.selectedOrigin || !this.selectedDestination) return false;

  const allowedDates = this.allFlights
    .filter(f => f.origin === this.selectedOrigin && f.destination === this.selectedDestination)
    .map(f => f.departureDate.split('T')[0]); // o ajusta si no hay T

  const dateOnly = dateIsoString.split('T')[0];
  return allowedDates.includes(dateOnly);
};

// book.page.ts
toggleDateSelector = false;

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

destinationImages = [
  { name: 'Barcelona (BCN)', image: 'assets/img/destinations/barcelona.jpg' },
  { name: 'Lisboa (LIS)', image: 'assets/img/destinations/lisboa.jpg' },
  { name: 'Madrid (MAD)', image: 'assets/img/destinations/madrid.jpg' },
  { name: 'Malaga (AGP)', image: 'assets/img/destinations/malaga.jpg' },
  { name: 'Palma (PMI)', image: 'assets/img/destinations/palma.jpg' },
  { name: 'Porto (POR)', image: 'assets/img/destinations/porto.jpg' },
];

selectDestinationFromImage(destinationName: string): void {
  this.selectedDestination = destinationName;
  this.filterOrigins();
  this.updateAvailableDates();
}

clearDateSelection(event: Event): void {
  event.stopPropagation();
  this.selectedDate = null;
    this.toggleDateSelector = false; // por si estaba abierto

}

async createBooking(): Promise<void> {
  try {
    // Verificar que se haya seleccionado un vuelo
    if (!this.selectedDate) {
      console.error('No date selected');
      return;
    }

    const selectedDateFormatted = this.selectedDate.split('T')[0];
    console.log('Buscando vuelo con:', {
      origin: this.selectedOrigin,
      destination: this.selectedDestination,
      date: selectedDateFormatted
    });

    const selectedFlight = this.allFlights.find(
      f => f.origin === this.selectedOrigin && 
          f.destination === this.selectedDestination && 
          f.departureDate.split('T')[0] === selectedDateFormatted
    );

    if (!selectedFlight) {
      console.error('No flight selected');
      return;
    }

    console.log('Vuelo encontrado:', selectedFlight);

    // Obtener el usuario actual
    const user = await this.authService.getCurrentUser();
    if (!user) {
      console.error('No user logged in');
      return;
    }

    console.log('Usuario autenticado:', user);

    // Obtener el userApp asociado
    const userApp = await firstValueFrom(this.usersAppService.getByUserId(user.id));
    if (!userApp) {
      console.error('UserApp not found');
      return;
    }

    console.log('UserApp encontrado:', userApp);

    // Extraer solo el ID del vuelo sin el prefijo "flights/"
    const flightId = selectedFlight.id.includes('/') ? 
      selectedFlight.id.split('/').pop() : 
      selectedFlight.id;

    if (!flightId) {
      console.error('ID de vuelo inválido');
      return;
    }

    if (!userApp.id) {
      console.error('ID de usuario inválido');
      return;
    }

    // Crear la reserva con los datos necesarios
    const booking = {
      id: '',
      bookingState: false,
      flightId: flightId,
      userAppId: userApp.id
    };

    console.log('Intentando crear reserva con:', booking);

    // Guardar la reserva y esperar a que se complete
    const createdBooking = await firstValueFrom(this.bookingsSvc.add(booking));
    console.log('Reserva creada:', createdBooking);

    // Verificar que la reserva se creó correctamente
    if (!createdBooking.userAppId || !createdBooking.flightId) {
      console.error('La reserva se creó pero faltan datos:', createdBooking);
      throw new Error('La reserva se creó incorrectamente');
    }
    
    alert('Reserva realizada con éxito');
    this.router.navigate(['/bookings']);
  } catch (error) {
    console.error('Error creating booking:', error);
    alert('Error al crear la reserva');
  }
}

async testCreateBooking(): Promise<void> {
  try {
    const testBooking = {
      id: '',
      bookingState: false,
      flightId: 'wx3iC3sUdkL37Ty2Eea7', // usa el ID de un vuelo que exista
      userAppId: 'W0J7IFVRTSiCOlx45TGx' // usa tu ID de usuario
    };

    console.log('Test - Intentando crear reserva con:', testBooking);
    console.log('Test - Estructura que se enviará a Firebase:', this.bookingsSvc.add(testBooking));
    
    const createdBooking = await firstValueFrom(this.bookingsSvc.add(testBooking));
    console.log('Test - Reserva creada:', createdBooking);
    console.log('Test - Documento en Firebase:', await firstValueFrom(this.bookingsSvc.getById(createdBooking.id)));
  } catch (error) {
    console.error('Error en test:', error);
  }
}

}
