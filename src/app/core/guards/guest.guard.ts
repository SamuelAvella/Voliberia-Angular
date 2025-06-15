/**
 * @file guest.guard.ts
 * @description Protección de rutas accesibles solo por usuarios no autenticados.
 */

import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { BaseAuthenticationService } from '../services/impl/base-authentication.service';
import { filter, map, switchMap, take } from 'rxjs';

/**
 * Guard que bloquea el acceso a usuarios ya autenticados.
 * Redirige a `/home` si el usuario ya ha iniciado sesión.
 *
 * @param route - Información sobre la ruta que se intenta activar.
 * @param state - Estado actual del router.
 * @returns Observable que emite `true` si el usuario NO está autenticado, `false` si lo está.
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(BaseAuthenticationService);
  const router = inject(Router);

  return authService.ready$.pipe(
    filter(isReady => isReady),
    take(1),
    switchMap(() => authService.authenticated$),
    map(isLoggedIn => {
      if (isLoggedIn) {
        router.navigate(['/home']);
        return false;
      }
      return true;
    })
  );
};
