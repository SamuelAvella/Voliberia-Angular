import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserApp } from '../../../core/models/userApp.model';

@Component({
  selector: 'app-confirm-role-modal',
  templateUrl: './confirm-role-modal.component.html',
  styleUrls: ['./confirm-role-modal.component.scss']
})
export class ConfirmRoleModalComponent {
  @Input() user!: UserApp;
  @Input() newRole!: string;

  constructor(private modalCtrl: ModalController) {}

  dismiss(confirmed: boolean) {
    this.modalCtrl.dismiss(confirmed);
  }
}
