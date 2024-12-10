import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { Flight } from "src/app/core/models/flight.model";

@Component({
  selector: 'app-flight-modal',
  templateUrl: './flight-modal.component.html',
  styleUrls: ['./flight-modal.component.scss'],
})
export class FlightModalComponent implements OnInit {
  @Input() flight?: Flight;

  formGroup: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      departureDate: ['', Validators.required],
      arrivalDate: ['', Validators.required],
      seatPrice: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    if (this.flight) {
      this.formGroup.patchValue(this.flight);
    }
  }

  onSubmit() {
    this.modalCtrl.dismiss(this.formGroup.value);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}