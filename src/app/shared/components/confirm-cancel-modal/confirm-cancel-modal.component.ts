/**
 * Modal de confirmación para cancelar una reserva.
 * Muestra información de la reserva y el vuelo correspondiente.
 */
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
  /** Reserva a cancelar */
  @Input() booking!: Booking;

  /** Vuelo asociado a la reserva */
  @Input() flight!: Flight;

  constructor(private modalCtrl: ModalController) {}

  /**
   * Cierra el modal con la decisión del usuario.
   * @param confirmed Indica si el usuario confirmó la cancelación
   */
  dismiss(confirmed: boolean): void {
    this.modalCtrl.dismiss(confirmed);
  }
}

