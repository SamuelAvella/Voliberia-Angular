/**
 * Modal de confirmación para cambiar el rol de un usuario.
 * Solicita confirmación antes de actualizar el rol.
 */
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserApp } from '../../../core/models/userApp.model';

@Component({
  selector: 'app-confirm-role-modal',
  templateUrl: './confirm-role-modal.component.html',
  styleUrls: ['./confirm-role-modal.component.scss']
})
export class ConfirmRoleModalComponent {
  /** Usuario cuyo rol será actualizado */
  @Input() user!: UserApp;

  /** Nuevo rol seleccionado */
  @Input() newRole!: string;

  constructor(private modalCtrl: ModalController) {}

  /**
   * Cierra el modal con la decisión del usuario.
   * @param confirmed Indica si el cambio de rol fue confirmado
   */
  dismiss(confirmed: boolean) {
    this.modalCtrl.dismiss(confirmed);
  }
}

