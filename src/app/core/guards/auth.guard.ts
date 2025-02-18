import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { BaseAuthenticationService } from '../services/impl/base-authentication.service';
import { filter, map, switchMap, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(BaseAuthenticationService);
    const router = inject(Router);
  
    return authService.ready$.pipe(
        filter(isReady => isReady), // Wait till `ready$` is true
        take(1), // Only take the first true value
        switchMap(() => authService.authenticated$), // Obtain the actual authentication value
        map(isLoggedIn => {
          if (isLoggedIn) {
            return true; // User authenticated, access aproved
          } else {
            // User unauthenticated, redirect to login 
            router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
          }
        })
    );
  };