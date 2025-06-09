import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Booking } from 'src/app/core/models/booking.model';
import { Flight } from 'src/app/core/models/flight.model';

@Component({
  selector: 'app-confirm-cancel-modal',
  templateUrl: './confirm-cancel-modal.component.html',
  styleUrls: ['./confirm-cancel-modal.component.scss'],
})
export class ConfirmCancelModalComponent {
  @Input() booking!: Booking;
  @Input() flight!: Flight;

  constructor(private modalCtrl: ModalController) {}

  dismiss(confirmed: boolean): void {
    this.modalCtrl.dismiss(confirmed);
  }
}
