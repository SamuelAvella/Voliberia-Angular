import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent {
  constructor(private popoverCtrl: PopoverController) {}

  selectLanguage(language: string) {
    this.popoverCtrl.dismiss({ language });
  }


}
