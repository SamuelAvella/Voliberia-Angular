import { Component, forwardRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InfiniteScrollCustomEvent, IonInput, IonPopover } from '@ionic/angular';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { Flight } from 'src/app/core/models/flight.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { FlightsService } from 'src/app/core/services/impl/flights.service';


@Component({
  selector: 'app-flight-selectable',
  templateUrl: './flight-selectable.component.html',
  styleUrls: ['./flight-selectable.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FlightSelectableComponent),
    multi: true}
  ]
})
export class FlightSelectableComponent implements OnInit, ControlValueAccessor, OnDestroy {

  flightSelected: Flight | null = null;
  disabled: boolean = true;
  private _flights: BehaviorSubject<Flight[]> = new BehaviorSubject<Flight[]>([]);
  public flights$ = this._flights.asObservable();

  propagateChange = (obj: any) => {}

  @ViewChild('popover', { read: IonPopover }) popover: IonPopover | undefined;

  page: number = 1;
  pageSize: number = 25;
  pages: number = 0;

  constructor(private flightsSvc: FlightsService) { }

  ngOnDestroy(): void {
    this.popover?.dismiss();
  }

  onLoadFlights() {
    this.loadFlights("");
  }

  private async loadFlights(filter: string) {
    this.page = 1;
    
    this.flightsSvc.getAll(this.page, this.pageSize, {"origin" : filter} ).subscribe({
      next: response => {
        this._flights.next([...response.data]);
        this.page++;
        this.pages = response.pages;
        console.log("Vuelo",...response.data)
      },
      error: err => {}
    });
  }

  loadMoreFlights(notify: HTMLIonInfiniteScrollElement | null = null) {
    if (this.page <= this.pages) {
      this.flightsSvc.getAll(this.page, this.pageSize).subscribe({
        next: (response: Paginated<Flight>) => {
          this._flights.next([...this._flights.value, ...response.data]);
          this.page++;
          notify?.complete();
        }
      });
    } else {
      notify?.complete();
    }
  }

  onMoreFlights(ev: InfiniteScrollCustomEvent) {
    this.loadMoreFlights(ev.target);
  }

  private async selectFlight(id: string | undefined, propagate: boolean = false) {
    if (id) {
      this.flightSelected = await lastValueFrom(this.flightsSvc.getById(id));
    } else {
      this.flightSelected = null;
    }
    if (propagate && this.flightSelected) {
      this.propagateChange(this.flightSelected.id);
    }
  }

  writeValue(obj: any): void {
    this.selectFlight(obj);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit() {}

  private async filter(filtering: string) {
    this.loadFlights(filtering);
  }

  onFilter(evt: any) {
    this.filter(evt.detail.value);
  }

  onFlightClicked(popover: IonPopover, flight: Flight) {
    this.selectFlight(flight.id, true);
    popover.dismiss();
  }

  clearSearch(input: IonInput) {
    input.value = "";
    this.filter("");
  }

  deselect(popover: IonPopover | null = null) {
    this.selectFlight(undefined, true);
    if (popover) popover.dismiss();
  }
}
