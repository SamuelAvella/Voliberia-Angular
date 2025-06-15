/**
 * @file auth.guard.ts
 * @description Protección de rutas que requieren usuario autenticado.
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BaseAuthenticationService } from '../services/impl/base-authentication.service';

/**
 * Guard que permite el acceso solo si el usuario está autenticado.
 * Redirige a la página de login si no lo está, incluyendo la URL de retorno.
 *
 * @param route - Información sobre la ruta que se intenta activar.
 * @param state - Estado actual del router, incluyendo la URL deseada.
 * @returns `true` si está autenticado, `false` si no.
 */
export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(BaseAuthenticationService);

  try {
    const user = await authService.getCurrentUser();
    if (!user) {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in auth guard:', error);
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
