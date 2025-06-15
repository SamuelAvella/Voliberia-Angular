/**
 * Componente raíz de la aplicación.
 * Se encarga de la navegación, cambio de idioma, visibilidad del header y permisos por rol.
 */
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

   /**
   * Lista de todas las páginas del menú, con roles permitidos.
   */
    public appPages = [
    { key: 'MENU.PAGES.HOME', url: '/home', icon: 'home-outline', title: '', position: 'left', roles: ['admin', 'user'] },
    { key: 'MENU.PAGES.BOOK', url: '/book', icon: 'book-outline', title: '', position: 'left', roles: ['user'] },
    { key: 'MENU.PAGES.FLIGHTS', url: '/flights', icon: 'airplane-outline', title: '', position: 'left', roles: ['admin'] },
    { key: 'MENU.PAGES.BOOKINGS', url: '/bookings', icon: 'file-tray-full-outline', title: '', position: 'left', roles: ['user'] },
    { key: 'MENU.PAGES.USERS', url: '/users', icon: 'people-outline', title: '', position: 'left', roles: ['admin'] },
    { key: 'MENU.PAGES.ABOUT', url: '/about', icon: 'information-circle-outline', title: '', position: 'left', roles: ['admin', 'user'] },
    { key: 'MENU.PAGES.PROFILE', url: '/profile', icon: 'person-circle-outline', title: '', position: 'right', roles: ['admin', 'user'] },
  ];

  /**
   * Páginas que se muestran a la izquierda del menú, filtradas por rol.
   */
  get leftPages() {
    return this.appPages
      .filter(p => p.position === 'left')
      .filter(p => this.userApp && p.roles.includes(this.userApp.role));
  }

  /**
   * Páginas disponibles para el rol actual.
   */
  get availablePages() {
    return this.appPages.filter(p => this.userApp && p.roles.includes(this.userApp.role));
  }

  /**
   * Rutas donde se debe ocultar el header (como login, splash, etc).
   */
  hiddenHeaderRoutes: string[] = [
    '/login', '/register', '/splash', 
    '/register?returnUrl=%2Fhome', '/login?returnUrl=%2Fhome', 
    '/access-denied', '/404'
  ];

  /**
   * Indica si el header debe ocultarse según la ruta actual.
   */
  get shouldHideHeader(): boolean {
    const current = this.router.url;
    return this.hiddenHeaderRoutes.some(route => current.startsWith(route));
  }

  /** Idioma actual */
  currentLang: string = 'es';
  /** Año actual */
  currentYear: number = new Date().getFullYear();
  /** Usuario autenticado */
  userApp?: UserApp | null;

  constructor(
    private translationService: TranslationService,
    private translate: TranslateService,
    public authSvc: BaseAuthenticationService,
    private usersAppSvc: UsersAppService,
    private router: Router,
    private popoverCtrl: PopoverController
  ) {
    const lang = this.translationService.getStoredLanguage();
  this.translationService.changeLanguage(lang);
  this.currentLang = lang;
  this.translate.onLangChange.subscribe(() => this.loadTranslations());
  }

  /**
   * Carga los títulos traducidos para el menú.
   */
  private loadTranslations() {
    this.appPages.forEach(page => {
      page.title = this.translate.instant(page.key);
    });
  }

  /**
   * Abre el selector de idioma en un popover.
   * @param ev Evento de clic
   */
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

  /**
   * Cierra sesión y redirige a la página de login.
   */
  logout() {
    this.authSvc.signOut().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  /**
   * Inicializa el componente, carga el usuario y redirecciona si no tiene permiso.
   */
  async ngOnInit() {
    try {
      this.authSvc.user$.subscribe(async (user) => {
      if (user) {
        this.userApp = await lastValueFrom(this.usersAppSvc.getByUserId(user.id));

        // Redirect if it's a non permiss page
        const currentUrl = this.router.url;
        const currentPage = this.appPages.find(p => p.url === currentUrl);
        if (currentPage && !currentPage.roles.includes(this.userApp!.role)) {
          this.router.navigate(['/home']);
        }
      } else {
        this.userApp = undefined;
      }
    });
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
}
