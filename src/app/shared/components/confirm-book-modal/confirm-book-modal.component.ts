import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-book-modal',
  templateUrl: './confirm-book-modal.component.html',
  styleUrls: ['./confirm-book-modal.component.scss'],
})
export class ConfirmBookModalComponent {

   @Input() origin!: string;
  @Input() destination!: string;
  @Input() departure!: string;
  @Input() arrival!: string;
  @Input() price!: number;

  constructor(private modalCtrl: ModalController) {}


  confirm() {
    this.modalCtrl.dismiss(true);
  }

  cancel() {
    this.modalCtrl.dismiss(false);
  }
}
