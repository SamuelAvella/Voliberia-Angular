import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Booking } from 'src/app/core/models/booking.model';
import { Flight } from 'src/app/core/models/flight.model';

@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.scss'],
})
export class BookingModalComponent implements OnInit {
  @Input() booking?: Booking;
  @Input() flights: Flight[] = [];
  formGroup: FormGroup;
  mode: 'new' | 'edit' = 'new';

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
    this.formGroup = this.fb.group({
      bookingState: [false, Validators.required],
      flightId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.booking) {
      this.mode = 'edit';
      this.formGroup.patchValue(this.booking);
    }
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.modalCtrl.dismiss(this.formGroup.value, this.mode);
    }
  }

  dismiss(): void {
    this.modalCtrl.dismiss();
  }
}
