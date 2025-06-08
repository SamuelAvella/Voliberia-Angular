import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BaseAuthenticationService } from '../services/impl/base-authentication.service';
import { UsersAppService } from '../services/impl/usersApp.service';
import { lastValueFrom } from 'rxjs';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return async () => {
    const router = inject(Router);
    const authService = inject(BaseAuthenticationService);
    const usersAppService = inject(UsersAppService);

    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        router.navigate(['/login']);
        return false;
      }

      const userApp = await lastValueFrom(usersAppService.getByUserId(user.id));
      if (!userApp || !allowedRoles.includes(userApp.role)) {
        router.navigate(['/access-denied']);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in role guard:', error);
      router.navigate(['/login']);
      return false;
    }
  };
}; 