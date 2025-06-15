/**
 * BookPage
 * Componente principal para gestionar reservas de vuelos.
 * Permite seleccionar origen, destino, fecha y hora de vuelo, y realizar la reserva.
*/
import { ModalController, ToastController } from '@ionic/angular';

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
import { FLIGHTS_COLLECTION_SUBSCRIPTION_TOKEN } from 'src/app/core/repositories/repository.token';
import { ICollectionSubscription } from 'src/app/core/services/interfaces/collection-subscription.interface';
import { FlightsService } from 'src/app/core/services/impl/flights.service';
import { BookingsService } from 'src/app/core/services/impl/bookings.service';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { UsersAppService } from 'src/app/core/services/impl/usersApp.service';
import { Booking } from 'src/app/core/models/booking.model';
import { ConfirmBookModalComponent } from "src/app/shared/components/confirm-book-modal/confirm-book-modal.component";


@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {
  private _flights = new BehaviorSubject<Flight[]>([]);
  flights$: Observable<Flight[]> = this._flights.asObservable();
  private loadedIds: Set<string> = new Set();
  private page = 1;
  private pageSize = 25;
  allFlights: Flight[] = [];

  currentLocale: string;

  selectedOrigin: string | null = null;
  selectedDestination: string | null = null;
  selectedDate: string | null = null;
  selectedTime: string | null = null;

  uniqueOrigins: string[] = [];
  uniqueDestinations: string[] = [];
  filteredOrigins: string[] = [];
  filteredDestinations: string[] = [];
  filteredOriginsSearch: string[] = [];
  filteredDestinationsSearch: string[] = [];
  searchOrigin = '';
  searchDestination = '';

  toggleOriginSelector = false;
  toggleDestinationSelector = false;
  toggleDateSelector = false;

  minSelectableDate = '';
  maxSelectableDate = '';
  disabledDates: string[] = [];
  flightsByDate: Map<string, string[]> = new Map();

  @ViewChild('originWrapper') originWrapper!: ElementRef;
  @ViewChild('originInput') originInput!: ElementRef<HTMLInputElement>;
  @ViewChild('destinationWrapper') destinationWrapper!: ElementRef;
  @ViewChild('destinationInput') destinationInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dateWrapper') dateWrapper!: ElementRef;

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
    private toastController: ToastController,
    private translateService: TranslateService,
    private bookingsSvc: BookingsService,
    private authService: BaseAuthenticationService,
    private usersAppService: UsersAppService,
    private router: Router,
    @Inject(FLIGHTS_COLLECTION_SUBSCRIPTION_TOKEN)
    private flightsSubscription: ICollectionSubscription<Flight>,
    private modalController: ModalController
  ) {
    this.currentLocale = this.translateService.currentLang || 'en-US';
    this.translateService.onLangChange.subscribe(
      (event) => (this.currentLocale = event.lang)
    );
  }

  /**
   * Inicializa la carga de vuelos y los orígenes/destinos disponibles.
   * @returns {void}
   */
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

  /**
   * Carga todos los vuelos disponibles paginados.
   * @param {HTMLIonInfiniteScrollElement | null} notify - Elemento opcional para notificar fin de scroll.
   * @returns {void}
   */
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

  /**
   * Filtra los orígenes según el origen seleccionado.
   * @returns {void}
   */
  filterOrigins(): void {
    this.filteredOrigins = this.selectedDestination
      ? [...new Set(this.allFlights.filter(f => f.destination === this.selectedDestination).map(f => f.origin))].sort()
      : [...this.uniqueOrigins];

    if (this.selectedOrigin && !this.filteredOrigins.includes(this.selectedOrigin)) {
      this.selectedOrigin = null;
      this.filterDestinations();
    }
  }

  /**
   * Filtra los orígenes según el destino seleccionado.
   * @returns {void}
   */
  filterDestinations(): void {
    this.filteredDestinations = this.selectedOrigin
      ? [...new Set(this.allFlights.filter(f => f.origin === this.selectedOrigin).map(f => f.destination))].sort()
      : [...this.uniqueDestinations];

    if (this.selectedDestination && !this.filteredDestinations.includes(this.selectedDestination)) {
      this.selectedDestination = null;
      this.filterOrigins();
    }
  }

  /**
   * Reinicia los filtros de búsqueda.
   * @returns {void}
   */
  resetFilters(): void {
    this.selectedOrigin = null;
    this.selectedDestination = null;
    this.filteredOrigins = [...this.uniqueOrigins];
    this.filteredDestinations = [...this.uniqueDestinations];
  }

  /**
   * Abre el selector de origen.
   * @param {Event} event - Evento de clic.
   * @returns {void}
   */
  openOriginSelector(event: Event): void {
    event.stopPropagation();
    this.stepSelectHour = false;
    this.toggleOriginSelector = true;
    this.toggleDestinationSelector = false;
    this.toggleDateSelector = false;
    this.searchOrigin = '';
    this.filteredOriginsSearch = [...this.filteredOrigins];
    setTimeout(() => this.originInput?.nativeElement.focus(), 0);
  }

  /**
   * Abre el selector de destino.
   * @param {Event} event - Evento de clic.
   * @returns {void}
   */
  openDestinationSelector(event: Event): void {
    event.stopPropagation();
    this.stepSelectHour = false;
    this.toggleDestinationSelector = true;
    this.toggleOriginSelector = false;
    this.toggleDateSelector = false;
    this.searchDestination = '';
    this.filteredDestinationsSearch = [...this.filteredDestinations];
    setTimeout(() => this.destinationInput?.nativeElement.focus(), 0);
  }


  /**
   * Abre el selector de fecha
   *
   * @param {Event} event
   */
  openDateSelector(event: Event): void {
    event.stopPropagation();
    this.toggleDateSelector = true;
    this.toggleOriginSelector = false;
    this.toggleDestinationSelector = false;
  }

  /**
   * Filtra los orígenes según el input
   * @returns {void}
   */
  filterOriginsSearch(): void {
    const term = this.searchOrigin.toLowerCase();
    this.filteredOriginsSearch = this.filteredOrigins.filter((o) => o.toLowerCase().includes(term));
  }

  /**
   * Filtra los destinos según el input
   * @returns {void}
  */
  filterDestinationsSearch(): void {
    const term = this.searchDestination.toLowerCase();
    this.filteredDestinationsSearch = this.filteredDestinations.filter((d) =>
      d.toLowerCase().includes(term)
    );
  }

  /**
   * Selecciona un origen
   *
   * @param {string} origin
   */
  selectOrigin(origin: string): void {
    this.selectedOrigin = origin;
    this.toggleOriginSelector = false;
    this.filterDestinations();
    this.updateAvailableDates();
  }

  /**
   * Selecciona un destino
   * @param {string} destination
   */
  selectDestination(destination: string): void {
    this.selectedDestination = destination;
    this.toggleDestinationSelector = false;
    this.filterOrigins();
    this.updateAvailableDates();
  }

  /**
   * Borra la selección de origen
   * @returns {void}
   */
  clearOriginSelection(event: Event): void {
    event.stopPropagation();
    this.stepSelectHour = false;
    this.toggleDateSelector = false;
    this.selectedOrigin = null;
    this.searchOrigin = '';
    this.filteredOriginsSearch = [...this.filteredOrigins];
    this.filterDestinations();
  }

  /**
   * Borra la selección de destino
   * @returns {void}
   */
  clearDestinationSelection(event: Event): void {
    event.stopPropagation();
    this.stepSelectHour = false;
    this.toggleDateSelector = false;
    this.selectedDestination = null;
    this.searchDestination = '';
    this.filteredDestinationsSearch = [...this.filteredDestinations];
    this.filterOrigins();
  }


  /**
   * Borra la seleccion de la fecha
   *
   * @param {Event} event
   * @returns {void}
   */
  clearDateSelection(event: Event): void {
    event.stopPropagation();
    this.stepSelectHour = false;
    this.selectedDate = null;
    this.toggleDateSelector = false;
  }

  /**
   * Maneja selección de fecha
   * @param event Evento de selección
   */
  onDateSelected(event: CustomEvent): void {
    this.selectedDate = event.detail.value.split('T')[0];
    this.selectedTime = null;
    console.log('📅 Día seleccionado:', this.selectedDate);
  }

  /**
   * Selecciona hora y cierra selector
   * @param time Hora seleccionada
   */
  selectTime(time: string): void {
    this.selectedTime = time;
    const datetime = `${this.selectedDate}T${this.selectedTime}:00`;
    console.log('✅ Fecha y hora seleccionada:', datetime);
    this.toggleDateSelector = false;
  }

  /**
   * Determina si una fecha tiene vuelos
   * @param dateIsoString Fecha en ISO string
   * @returns {boolean} Verdadero si hay vuelos
   */
  isFlightDate = (dateIsoString: string): boolean => {
    const dateOnly = dateIsoString.split('T')[0];
    return this.flightsByDate.has(dateOnly);
  };

  /**
   * Actualiza las fechas disponibles
   */
  updateAvailableDates(): void {
    if (!this.selectedOrigin || !this.selectedDestination) return;

    const matching = this.allFlights.filter(
      f => f.origin === this.selectedOrigin && f.destination === this.selectedDestination
    );

    this.flightsByDate.clear();

    for (const flight of matching) {
      const [date, time] = flight.departureDate.split('T');
      if (!this.flightsByDate.has(date)) {
        this.flightsByDate.set(date, []);
      }
      this.flightsByDate.get(date)!.push(time.slice(0, 5));
    }

    const keys = [...this.flightsByDate.keys()];
    this.minSelectableDate = keys[0] ?? '';
    this.maxSelectableDate = keys.slice(-1)[0] ?? '';
    this.disabledDates = this.getDisabledDatesInRange(this.minSelectableDate, this.maxSelectableDate, keys);

    this.selectedDate = null;
    this.selectedTime = null;
  }

  /**
   * Obtiene fechas deshabilitadas
   * @param min Fecha mínima
   * @param max Fecha máxima
   * @param allowed Fechas válidas
   * @returns {string[]} Fechas deshabilitadas
   */
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

  /**
   * Selecciona destino desde imagen destacada
   * @param destinationName Nombre del destino
   */
  selectDestinationFromImage(destinationName: string): void {
    this.selectedDestination = destinationName;
    this.filterOrigins();
    this.updateAvailableDates();
  }


  /**
   * Detecta clics fuera de los selectores
   * @param event Evento de clic
   */
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


  /**
   * Crea una reserva de vuelo
   * @async
   * @returns {Promise<void>}
   */
  async createBooking(): Promise<void> {
    try {
      if (!this.selectedDate || !this.selectedTime) {
        console.error('[createBooking] ❌ Falta fecha u hora seleccionada');
        return;
      }

      const selectedDateTime = `${this.selectedDate}T${this.selectedTime}:00`;

      const selectedFlight = this.allFlights.find(
        f =>
          f.origin === this.selectedOrigin &&
          f.destination === this.selectedDestination &&
          f.departureDate === selectedDateTime
      );

      if (!selectedFlight) {
        console.error('[createBooking] ❌ No se encontró vuelo con esa fecha y hora:', selectedDateTime);
        return;
      }

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
        userAppId: userApp.id,
      };

      const created = await firstValueFrom(this.bookingsSvc.add(booking));
      const fakeEvent = new Event('click');
      this.clearOriginSelection(fakeEvent);
      this.clearDestinationSelection(fakeEvent);
      this.clearDateSelection(fakeEvent);
      const toastSuccess = await this.toastController.create({
        message: await this.translateService.get('BOOK.SUCCESS').toPromise(),      
        duration: 3000,
        position: 'bottom',
        color: 'success',
      });
      await toastSuccess.present();
      this.router.navigate(['/bookings'], {
        state: { reload: true }
      });

    } catch (error) {
      const toastSuccess = await this.toastController.create({
        message: await this.translateService.instant('COMMON.ERROR.SAVE'), // por ejemplo: "Error al guardar"
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toastSuccess.present();
      console.error('[createBooking] ❌ Error:', error);
    }
  }

  async confirmBookingAlert() {
    const flightDateTime = `${this.selectedDate}, ${this.selectedTime}h`;

    const selectedFlight = this.allFlights.find(
      f =>
        f.origin === this.selectedOrigin &&
        f.destination === this.selectedDestination &&
        f.departureDate === `${this.selectedDate}T${this.selectedTime}:00`
    );

    if (!selectedFlight) {
      const toastSuccess = await this.toastController.create({
        message: await this.translateService.instant('COMMON.ERROR.SAVE'), // por ejemplo: "Error al guardar"
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toastSuccess.present();
      return;
    }

    const price = selectedFlight.seatPrice ?? 'Desconocido';

    // Formatea las fechas
    const departure = new Date(selectedFlight.departureDate).toLocaleString('es-ES', {

    });

    const arrival = new Date(selectedFlight.arrivalDate).toLocaleString('es-ES', {

    });

    const modal = await this.modalController.create({
      component: ConfirmBookModalComponent,
      cssClass: 'custom-tailwind-modal', // clase para hacer el fondo transparente
      showBackdrop: true,
      backdropDismiss: true,
      componentProps: {
        origin: selectedFlight.origin,
        destination: selectedFlight.destination,
        departure,
        arrival,
        price: selectedFlight.seatPrice ?? 'Desconocido'
      }
    });

    await modal.present();


    const { data } = await modal.onDidDismiss();
    if (data === true) {
      
      this.createBooking();
    }
  }



  scrollToCarousel() {
    const el = document.getElementById('carousel-title');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  stepSelectHour = false;


}
