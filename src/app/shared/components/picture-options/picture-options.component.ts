/**
 * Componente que muestra un popover con opciones para seleccionar una imagen:
 * tomar foto, elegir desde galería o cancelar.
 */
import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  template: `
    <ion-list>
      <ion-item button (click)="onOption('camera')">
        <ion-icon name="camera" slot="start"></ion-icon>
        <ion-label>{{'PICTURE.OPTIONS.TAKE_PHOTO' | translate}}</ion-label>
      </ion-item>
      <ion-item button (click)="onOption('gallery')">
        <ion-icon name="image" slot="start"></ion-icon>
        <ion-label>{{'PICTURE.OPTIONS.SELECT_FROM_GALLERY' | translate}}</ion-label>
      </ion-item>
      <ion-item button (click)="onOption('cancel')">
        <ion-icon name="close" slot="start"></ion-icon>
        <ion-label>{{'PICTURE.OPTIONS.CANCEL' | translate}}</ion-label>
      </ion-item>
    </ion-list>
  `
})
export class PictureOptionsComponent {
  constructor(private popoverCtrl: PopoverController) {}

  /**
   * Cierra el popover y devuelve la opción seleccionada.
   * @param option Opción seleccionada: 'camera', 'gallery' o 'cancel'
   */
  onOption(option: string) {
    this.popoverCtrl.dismiss(option);
  }
} 