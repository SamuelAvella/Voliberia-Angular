import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },

  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then(m => m.SplashPage)
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'flights',
    canActivate: [authGuard, (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => roleGuard(['admin'])(route, state)],
    loadChildren: () => import('./pages/flights/flights.module').then( m => m.FlightsPageModule)
  },
  {
    path: 'bookings',
    canActivate: [authGuard, (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => roleGuard(['user'])(route, state)],
    loadChildren: () => import('./pages/bookings/bookings.module').then( m => m.BookingsPageModule)
  },
  {
    path: 'about',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'book',
    canActivate: [authGuard, (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => roleGuard(['user'])(route, state)],
    loadChildren: () => import('./pages/book/book.module').then( m => m.BookPageModule)
  },
  {
    path: 'users',
    canActivate: [authGuard, (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => roleGuard(['admin'])(route, state)],
    loadChildren: () => import('./pages/users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'access-denied',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/access-denied/access-denied.page').then(m => m.AccessDeniedPage)
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found.page').then(m => m.NotFoundPage)
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
