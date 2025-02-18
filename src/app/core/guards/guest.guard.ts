import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { BaseAuthenticationService } from '../services/impl/base-authentication.service';
import { filter, map, switchMap, take } from 'rxjs';

export const guestGuard: CanActivateFn = (route, state) => {
    const authService = inject(BaseAuthenticationService);
    const router = inject(Router);

    return authService.ready$.pipe(
        filter(isReady => isReady), // Wait till `ready$` is true
        take(1), // Only take the first true value
        switchMap(() => authService.authenticated$), // Obtain the actual authentication value
        map(isLoggedIn => {
            if (isLoggedIn) {
                // User authenticated, redirect to '/home'
                router.navigate(['/home']);
                return false; // Block route access
            }
            return true; // Allow access
        })
    );
};
