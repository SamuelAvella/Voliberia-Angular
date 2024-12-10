import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Flight } from 'src/app/core/models/flight.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { FlightsService } from 'src/app/core/services/impl/flights.service';

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

  constructor(private flightsSvc: FlightsService) {}

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

  openFlightDetail(flight: Flight, index: number) {
    console.log('Flight selected:', flight);
  }

  onIonInfinite(ev: any) {
    this.getMoreFlights(ev.target);
  }
}
