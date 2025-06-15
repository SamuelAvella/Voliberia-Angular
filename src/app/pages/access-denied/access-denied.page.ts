/**
 * Página de acceso denegado.
 * Se muestra cuando el usuario intenta acceder a una ruta sin permisos.
 */
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.html'
})
export class AccessDeniedPage {
  constructor(
    private location: Location,
    private router: Router
  ) {}

  /**
   * Vuelve atrás en el historial o redirige al home si la ruta anterior era restringida.
   */
  goBack() {
    const previousUrl = document.referrer;

    const restrictedPaths = ['/flights', '/bookings', '/book'];
    const isRestrictedPath = restrictedPaths.some(path => previousUrl.includes(path));

    if (isRestrictedPath) {
      this.goHome(); 
    } else {
      this.location.back(); 
    }
  }

  /**
   * Redirige a la página de inicio.
   */
  goHome() {
    this.router.navigate(['/home']);
  }
}
