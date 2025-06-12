import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { Flight } from "src/app/core/models/flight.model";
import { arrivalDateValidator } from "../../validators/date.validators";

@Component({
  selector: 'app-flight-modal',
  templateUrl: './flight-modal.component.html',
  styleUrls: ['./flight-modal.component.scss'],
})
export class FlightModalComponent implements OnInit {

  
  @Input() flight?: Flight;

  @ViewChild('departureWrapper') departureWrapper!: ElementRef;
  @ViewChild('arrivalWrapper') arrivalWrapper!: ElementRef;

  formGroup: FormGroup;

  toggleDateSelector: 'departure' | 'arrival' | null = null;
  toggleTimeSelector: 'departure' | 'arrival' | null = null;

  departureDate: string | null = null;
  departureTime: string | null = null;

  arrivalDate: string | null = null;
  arrivalTime: string | null = null;

  minDepartureDate = new Date().toISOString();
  minArrivalDate = new Date(Date.now() + 40 * 60000).toISOString();

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      origin: ['', [Validators.required, Validators.minLength(3)]],
      destination: ['', [Validators.required, Validators.minLength(3)]],
      departureDate: ['', [Validators.required]],
      arrivalDate: ['', [Validators.required]],
      seatPrice: [0, [Validators.required, Validators.min(15)]],
    }, { validators: arrivalDateValidator });
  }

  ngOnInit(): void {
    if (this.flight) {
      this.formGroup.patchValue(this.flight);
      const [depDate, depTime] = this.flight.departureDate.split('T');
      const [arrDate, arrTime] = this.flight.arrivalDate.split('T');
      this.departureDate = depDate;
      this.departureTime = depTime?.slice(0, 5) ?? null;
      this.arrivalDate = arrDate;
      this.arrivalTime = arrTime?.slice(0, 5) ?? null;
    }
  }

  dismiss(): void {
    this.modalCtrl.dismiss();
  }

  onSubmit(): void {
    this.modalCtrl.dismiss(this.formGroup.value);
  }

  openDateSelector(type: 'departure' | 'arrival', event: Event): void {
    event.stopPropagation();
    this.toggleDateSelector = type;
    this.toggleTimeSelector = null;
  }

  onDatePartSelected(event: CustomEvent, type: 'departure' | 'arrival', originalEvent?: Event): void {
    originalEvent?.stopPropagation();
    const date = event.detail.value;
    if (type === 'departure') {
      this.departureDate = date;
    } else {
      this.arrivalDate = date;
    }
    this.toggleDateSelector = null;
    this.toggleTimeSelector = type;
  }

  onTimePartSelected(event: CustomEvent, type: 'departure' | 'arrival'): void {
    const time = event.detail.value;
    if (type === 'departure') {
      this.departureTime = time;
      this.formGroup.get('departureDate')?.setValue(
        this.combineDateTime(this.departureDate!, time)
      );
    } else {
      this.arrivalTime = time;
      this.formGroup.get('arrivalDate')?.setValue(
        this.combineDateTime(this.arrivalDate!, time)
      );
    }
    this.toggleTimeSelector = null;
  }

  clearDate(type: 'departure' | 'arrival'): void {
    if (type === 'departure') {
      this.departureDate = null;
      this.departureTime = null;
      this.formGroup.get('departureDate')?.reset();
    } else {
      this.arrivalDate = null;
      this.arrivalTime = null;
      this.formGroup.get('arrivalDate')?.reset();
    }
    this.toggleDateSelector = null;
    this.toggleTimeSelector = null;
  }

  combineDateTime(dateStr: string, timeStr: string): string {
    return new Date(`${dateStr}T${timeStr}`).toISOString();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    const path = event.composedPath();
    if (
      this.toggleDateSelector &&
      this.departureWrapper &&
      !path.includes(this.departureWrapper.nativeElement) &&
      this.toggleDateSelector === 'departure'
    ) {
      this.toggleDateSelector = null;
    }
    if (
      this.toggleTimeSelector &&
      this.departureWrapper &&
      !path.includes(this.departureWrapper.nativeElement) &&
      this.toggleTimeSelector === 'departure'
    ) {
      this.toggleTimeSelector = null;
    }
    if (
      this.toggleDateSelector &&
      this.arrivalWrapper &&
      !path.includes(this.arrivalWrapper.nativeElement) &&
      this.toggleDateSelector === 'arrival'
    ) {
      this.toggleDateSelector = null;
    }
    if (
      this.toggleTimeSelector &&
      this.arrivalWrapper &&
      !path.includes(this.arrivalWrapper.nativeElement) &&
      this.toggleTimeSelector === 'arrival'
    ) {
      this.toggleTimeSelector = null;
    }
  }
}
