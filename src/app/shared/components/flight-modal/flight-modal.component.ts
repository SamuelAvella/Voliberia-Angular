import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { Flight } from "src/app/core/models/flight.model";
import { arrivalDateValidator, dateNotInThePast } from "../../validators/date.validators";

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
      origin: ['', [Validators.required, Validators.minLength(3)]],
      destination: ['', [Validators.required, Validators.minLength(3)]],
      departureDate: ['', [Validators.required, dateNotInThePast]],
      arrivalDate: ['', [Validators.required, dateNotInThePast]],
      seatPrice: [0, [Validators.required, Validators.min(15)]],
    }, { validators: arrivalDateValidator });
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