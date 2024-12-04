import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  
  {
    path: 'splash',
    loadChildren: () => import('./pages/splash/splash.page').then( m => m.SplashPage)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'flights',
    loadChildren: () => import('./pages/flights/flights.module').then( m => m.FlightsPageModule)
  },
  {
    path: 'bookings',
    loadChildren: () => import('./pages/bookings/bookings.module').then( m => m.BookingsPageModule)
  },
  {
    path: 'user-app',
    loadChildren: () => import('./pages/user-app/user-app.module').then( m => m.UserAppPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
