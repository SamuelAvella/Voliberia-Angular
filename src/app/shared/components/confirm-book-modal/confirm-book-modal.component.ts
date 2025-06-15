
/**
 * Modal de confirmación para reservar un vuelo.
 * Muestra detalles del vuelo antes de confirmar la reserva.
 */
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-confirm-book-modal',
  templateUrl: './confirm-book-modal.component.html',
  styleUrls: ['./confirm-book-modal.component.scss'],
})
export class ConfirmBookModalComponent {

  /** Ciudad de origen */
  @Input() origin!: string;

  /** Ciudad de destino */
  @Input() destination!: string;

  /** Fecha de salida */
  @Input() departure!: string;

  /** Fecha de llegada */
  @Input() arrival!: string;

  /** Precio del vuelo */
  @Input() price!: number;

  constructor(private modalCtrl: ModalController) {}

  /** Confirma la reserva */
  confirm() {
    this.modalCtrl.dismiss(true);
  }

  /** Cancela la reserva */
  cancel() {
    this.modalCtrl.dismiss(false);
  }
}

