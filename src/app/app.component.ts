import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

import { BaseAuthenticationService } from './core/services/impl/base-authentication.service';

import { LanguageSelectorComponent } from './shared/components/language-selector/language-selector.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from './core/services/translation.service';
import { UserApp } from './core/models/userApp.model';
import { lastValueFrom } from 'rxjs';
import { UsersAppService } from './core/services/impl/usersApp.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { key: 'MENU.PAGES.HOME', url: '/home', icon: 'home', title: '' },
    { key: 'MENU.PAGES.FLIGHTS', url: '/flights', icon: 'airplane', title: '' },
    { key: 'MENU.PAGES.BOOKINGS', url: '/bookings', icon: 'book', title: '' },
    { key: 'MENU.PAGES.PROFILE', url: '/profile', icon: 'person', title: '' },
    { key: 'MENU.PAGES.ABOUT', url: '/about', icon: 'newspaper', title: ''}
  ];

  currentYear: number = new Date().getFullYear();
  userApp?: UserApp | null;

  constructor(
    private translationService: TranslationService,
    private translate: TranslateService,
    public authSvc: BaseAuthenticationService,
    private usersAppSvc: UsersAppService,
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
      this.loadTranslations(); // Load updated translations

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

  
  async ngOnInit() {
    try {
      // Get authenticated user from authService
      const user = await this.authSvc.getCurrentUser();

      if (user) {
        this.userApp = await lastValueFrom(this.usersAppSvc.getByUserId(user.id));
        console.log("El userApp",this.userApp);
        
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
}
