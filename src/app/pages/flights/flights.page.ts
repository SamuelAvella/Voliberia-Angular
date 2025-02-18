import { Component, OnInit } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Flight } from "src/app/core/models/flight.model";
import { Paginated } from "src/app/core/models/paginated.model";
import { BookingsStrapiRepositoryService } from "src/app/core/repositories/impl/bookings-strapi-repository.service";
import { BookingsService } from "src/app/core/services/impl/bookings.service";
import { FlightsService } from "src/app/core/services/impl/flights.service";
import { FlightModalComponent } from "src/app/shared/components/flight-modal/flight-modal.component";

@Component({
  selector: 'app-flights',
  templateUrl: './flights.page.html',
  styleUrls: ['./flights.page.scss'],
})
export class FlightsPage implements OnInit {
  _flights: BehaviorSubject<Flight[]> = new BehaviorSubject<Flight[]>([]);
  flights$: Observable<Flight[]> = this._flights.asObservable();
  page: number = 1;
  pageSize: number = 25;

  currentLocale: string;


  constructor(
    private flightsSvc: FlightsService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private bookingsSvc: BookingsService,
    private translateService: TranslateService

  ) {
    this.currentLocale = this.translateService.currentLang || 'en-US';
    this.translateService.onLangChange.subscribe((event) => {
      this.currentLocale = event.lang; // Cambiar idioma cuando se actualice
    });
  }

  ngOnInit(): void {
    this.getMoreFlights();
  }

  getMoreFlights(notify: HTMLIonInfiniteScrollElement | null = null): void {
    console.log('Llamando a getMoreFlights');
    this.flightsSvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Flight>) => {
        const existingIds = this._flights.value.map((flight) => flight.id);
        const newFlights = response.data.filter((flight) => !existingIds.includes(flight.id));
        
        const sortedFlights = [...this._flights.value, ...newFlights]
          .sort((a, b) => a.origin.localeCompare(b.origin)); 

        this._flights.next(sortedFlights);
        this.page++;
        notify?.complete();
      },
      error: (err) => {
        console.error('Error cargando vuelos:', err);
        notify?.complete();
      },
    });
  }
  

  async onAddFlight() {
    const modal = await this.modalCtrl.create({
      component: FlightModalComponent,
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.flightsSvc.add(result.data).subscribe(() => {
          console.log('Vuelo agregado, refrescando lista');
          this.refreshFlights();
        });
      }
    });
  
    await modal.present();
  }
  
  async onEditFlight(flight: Flight) {
    const modal = await this.modalCtrl.create({
      component: FlightModalComponent,
      componentProps: { flight },
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.flightsSvc.update(flight.id, result.data).subscribe(() => {
          console.log('Vuelo editado, refrescando lista');
          this.refreshFlights();
        });
      }
    });
  
    await modal.present();
  }
  
  async onDeleteFlight(flight: Flight) {
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
            this.bookingsSvc.deleteBookingsByFlightId(flight.id).subscribe({
              next: () => {
                this.flightsSvc.delete(flight.id).subscribe(() => {
                  console.log('Vuelo eliminado, refrescando lista');
                  this.refreshFlights();
                });
              },
              error: (err) => console.error('Error eliminando bookings:', err),
            });
          },
        },
      ],
    });

    await alert.present();
  }
  
  
  

  refreshFlights(): void {
    console.log('Llamando a refreshFlights');
    this.page = 1; // Reinicia la paginación
    this._flights.next([]); // Limpia la lista actual
    this.getMoreFlights(); // Carga vuelos desde la primera página
  }
  

  onIonInfinite(ev: any) {
    this.getMoreFlights(ev.target);
  }
}