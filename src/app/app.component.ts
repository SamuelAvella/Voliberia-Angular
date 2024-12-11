import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { TranslationService } from './core/services/translation.service';
import { BaseAuthenticationService } from './core/services/impl/base-authentication.service';
import { LanguageSelectorComponent } from './shared/components/language-selector/language-selector.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { key: 'MENU.PAGES.HOME', url: '/home', icon: 'home', title: '' },
    { key: 'MENU.PAGES.FLIGHTS', url: '/flights', icon: 'airplane', title: '' },
    { key: 'MENU.PAGES.BOOKINGS', url: '/bookings', icon: 'book', title: '' },
    { key: 'MENU.PAGES.PROFILE', url: '/profile', icon: 'person', title: '' },
  ];

  currentYear: number = new Date().getFullYear();

  constructor(
    private translationService: TranslationService,
    private translate: TranslateService,
    public authSvc: BaseAuthenticationService,
    private router: Router,
    private popoverCtrl: PopoverController
  ) {
    this.loadTranslations();
    this.translate.onLangChange.subscribe(() => this.loadTranslations());
  }

  private loadTranslations() {
    this.appPages.forEach(page => {
      page.title = this.translate.instant(page.key);
    });
  }

  async openLanguageSelector(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: LanguageSelectorComponent,
      event: ev,
      translucent: true,
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (data?.language) {
      this.translationService.changeLanguage(data.language);
      this.loadTranslations(); // Cargar las traducciones actualizadas

      const menu = document.querySelector('ion-menu');
      if (menu) {
        (menu as any).close();
      }
    }
  }

  logout() {
    this.authSvc.signOut().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
