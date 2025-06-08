import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BaseAuthenticationService } from '../services/impl/base-authentication.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(BaseAuthenticationService);

  try {
    const user = await authService.getCurrentUser();
    if (!user) {
      // Store the attempted URL for redirecting after login
      router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in auth guard:', error);
    router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
};