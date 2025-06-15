/**
 * Componente que permite seleccionar un idioma desde un popover.
 * Utilizado en la cabecera de la aplicación.
 */
import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent {

  constructor(private popoverCtrl: PopoverController) {}

  /**
   * Selecciona un idioma y cierra el popover.
   * @param language Código del idioma seleccionado (ej. 'es', 'en')
   */
  selectLanguage(language: string) {
    this.popoverCtrl.dismiss({ language });
  }
}
