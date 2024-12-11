import { Component, OnInit } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
import { BehaviorSubject, Observable } from "rxjs";
import { Flight } from "src/app/core/models/flight.model";
import { Paginated } from "src/app/core/models/paginated.model";
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

  constructor(
    private flightsSvc: FlightsService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    this.getMoreFlights();
  }

  getMoreFlights(notify: HTMLIonInfiniteScrollElement | null = null) {
    this.flightsSvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Flight>) => {
        this._flights.next([...this._flights.value, ...response.data]);
        this.page++;
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
        this.flightsSvc.add(result.data).subscribe(() => this.refreshFlights());
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
        this.flightsSvc.update(flight.id, result.data).subscribe(() =>
          this.refreshFlights()
        );
      }
    });

    await modal.present();
  }

  async onDeleteFlight(flight: Flight) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this flight and all its bookings?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.flightsSvc.delete(flight.id).subscribe(() => this.refreshFlights());
          },
        },
      ],
    });

    await alert.present();
  }

  refreshFlights() {
    this.page = 1;
    this._flights.next([]);
    this.getMoreFlights();
  }

  onIonInfinite(ev: any) {
    this.getMoreFlights(ev.target);
  }
}