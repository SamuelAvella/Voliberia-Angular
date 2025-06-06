import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Flight } from "src/app/core/models/flight.model";
import { Paginated } from "src/app/core/models/paginated.model";
import { FlightsService } from "src/app/core/services/impl/flights.service";
import { CollectionChange, ICollectionSubscription } from "src/app/core/services/interfaces/collection-subscription.interface";
import { FLIGHTS_COLLECTION_SUBSCRIPTION_TOKEN } from "src/app/core/repositories/repository.token";
import { DatetimeChangeEventDetail } from "@ionic/angular";
import { IonDatetimeCustomEvent } from "@ionic/core";
import { CalendarEvent } from "angular-calendar";

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

onDateSelected(): void {
  this.toggleDateSelector = false;
}

destinationImages = [
  { name: 'Madrid (MAD)', image: 'assets/img/destinations/madrid.jpg' },
  { name: 'Barcelona', image: 'assets/img/destinations/barcelona.jpg' },
  { name: 'Sevilla', image: 'assets/img/destinations/sevilla.jpg' },
  { name: 'Valencia', image: 'assets/img/destinations/valencia.jpg' },
  { name: 'Bilbao', image: 'assets/img/destinations/bilbao.jpg' },
];

selectDestinationFromImage(destinationName: string): void {
  this.selectedDestination = destinationName;
  this.filterOrigins();
  this.updateAvailableDates();
}


}
