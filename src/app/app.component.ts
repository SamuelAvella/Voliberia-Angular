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
 
  // Todas las páginas, centralizadas
  public appPages = [
    { key: 'MENU.PAGES.HOME', url: '/home', icon: 'home-outline', title: '', position: 'left' },
    { key: 'MENU.PAGES.BOOK', url: '/book', icon: 'book-outline', title: '', position: 'left' },
    { key: 'MENU.PAGES.FLIGHTS', url: '/flights', icon: 'airplane-outline', title: '', position: 'left' },
    { key: 'MENU.PAGES.BOOKINGS', url: '/bookings', icon: 'file-tray-full-outline', title: '', position: 'left' },
    { key: 'MENU.PAGES.ABOUT', url: '/about', icon: 'information-circle-outline', title: '', position: 'left' },
    { key: 'MENU.PAGES.PROFILE', url: '/profile', icon: 'person-circle-outline', title: '', position: 'right' },
  ];

  // Filtrados para el header
  get leftPages() {
    return this.appPages.filter(p => p.position === 'left');
  }

  get rightPages() {
    return this.appPages.filter(p => p.position === 'right');
  }

  hiddenHeaderRoutes: string[] = ['/login', '/register', '/splash', '/register?returnUrl=%2Fhome', '/login?returnUrl=%2Fhome'];

  get shouldHideHeader(): boolean {
    const current = this.router.url;
    return this.hiddenHeaderRoutes.includes(current);
  }

  currentLang: string = 'es'; 
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
    this.currentLang = this.translate.currentLang || this.translate.getDefaultLang();
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
