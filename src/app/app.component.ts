import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

import { BaseAuthenticationService } from './core/services/impl/base-authentication.service';

import { LanguageSelectorComponent } from './shared/components/language-selector/language-selector.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from './core/services/translation.service';
import { UserApp, UserRole } from './core/models/userApp.model';
import { lastValueFrom } from 'rxjs';
import { UsersAppService } from './core/services/impl/usersApp.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  // All pages with role restrictions
  public appPages = [
    { key: 'MENU.PAGES.HOME', url: '/home', icon: 'home-outline', title: '', position: 'left', roles: ['admin', 'user'] },
    { key: 'MENU.PAGES.BOOK', url: '/book', icon: 'book-outline', title: '', position: 'left', roles: ['user'] },
    { key: 'MENU.PAGES.FLIGHTS', url: '/flights', icon: 'airplane-outline', title: '', position: 'left', roles: ['admin'] },
    { key: 'MENU.PAGES.BOOKINGS', url: '/bookings', icon: 'file-tray-full-outline', title: '', position: 'left', roles: ['user'] },
    { key: 'MENU.PAGES.USERS', url: '/users', icon: 'people-outline', title: '', position: 'left', roles: ['admin'] },
    { key: 'MENU.PAGES.ABOUT', url: '/about', icon: 'information-circle-outline', title: '', position: 'left', roles: ['admin', 'user'] },
    { key: 'MENU.PAGES.PROFILE', url: '/profile', icon: 'person-circle-outline', title: '', position: 'right', roles: ['admin', 'user'] },
  ];

  // Filtered for the header based on role and position
  get leftPages() {
    return this.appPages
      .filter(p => p.position === 'left')
      .filter(p => this.userApp && p.roles.includes(this.userApp.role));
  }

  get rightPages() {
    return this.appPages
      .filter(p => p.position === 'right')
      .filter(p => this.userApp && p.roles.includes(this.userApp.role));
  }

  // Get all pages available for current user role
  get availablePages() {
    return this.appPages.filter(p => this.userApp && p.roles.includes(this.userApp.role));
  }

  hiddenHeaderRoutes: string[] = ['/login', '/register', '/splash', '/register?returnUrl=%2Fhome', '/login?returnUrl=%2Fhome', '/access-denied', '/404'];

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
      this.loadTranslations();

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
      const user = await this.authSvc.getCurrentUser();

      if (user) {
        this.userApp = await lastValueFrom(this.usersAppSvc.getByUserId(user.id));

        // Redirect if user tries to access unauthorized page
        const currentUrl = this.router.url;
        const currentPage = this.appPages.find(p => p.url === currentUrl);
        if (currentPage && this.userApp && !currentPage.roles.includes(this.userApp.role)) {
          this.router.navigate(['/home']);
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
}
