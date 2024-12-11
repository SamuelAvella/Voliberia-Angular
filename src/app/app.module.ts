import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { TranslateModule,TranslateLoader } from '@ngx-translate/core';
import { SharedModule } from './shared/shared.module';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, BACKEND_TOKEN, BOOKINGS_API_URL_TOKEN, BOOKINGS_RESOURCE_NAME_TOKEN, FLIGHTS_API_URL_TOKEN, FLIGHTS_RESOURCE_NAME_TOKEN, UPLOAD_API_URL_TOKEN, USERSAPP_API_URL_TOKEN, USERSAPP_RESOURCE_NAME_TOKEN } from './core/repositories/repository.token';
import { environment } from 'src/environments/environment';
import {  } from 'src/environments/environment.prod';
import { UsersAppService } from './core/services/impl/usersApp.service';
import { FlightsService } from './core/services/impl/flights.service';
import { AuthenticationServiceFactory, AuthMappingFactory, BookingsMappingFactory, BookingsRepositoryFactory, FlightsRepositoryFactory, FlightsMappingFactory, MediaServiceFactory, UsersAppMappingFactory, UsersAppRepositoryFactory } from './core/repositories/repository.factory';
import { FormsModule } from '@angular/forms';
import { BookingsService } from './core/services/impl/bookings.service';

// Factory function para el loader de traducción
export function createTranslateLoader(http: HttpClient){
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    FormsModule, 
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    SharedModule
  ],
  providers: [
    { provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy
    },
    provideLottieOptions({
      player:() => player,
    }),
    provideHttpClient(),
    { provide: BACKEND_TOKEN, useValue: 'strapi' },
    { provide: USERSAPP_RESOURCE_NAME_TOKEN, useValue: 'user-apps' },
    { provide: BOOKINGS_RESOURCE_NAME_TOKEN, useValue: 'bookings' },
    { provide: FLIGHTS_RESOURCE_NAME_TOKEN, useValue: 'fligths' },
    { provide: USERSAPP_API_URL_TOKEN, useValue: `${environment.apiUrl}/api` },
    { provide: BOOKINGS_API_URL_TOKEN, useValue: `${environment.apiUrl}/api` },
    { provide: FLIGHTS_API_URL_TOKEN, useValue: `${environment.apiUrl}/api` },
    { provide: AUTH_SIGN_IN_API_URL_TOKEN, useValue: `${environment.apiUrl}/api/auth/local` },
    { provide: AUTH_SIGN_UP_API_URL_TOKEN, useValue: `${environment.apiUrl}/api/auth/local/register` },
    { provide: AUTH_ME_API_URL_TOKEN, useValue: `${environment.apiUrl}/api/users/me` },
    { provide: UPLOAD_API_URL_TOKEN, useValue: `${environment.apiUrl}/api/upload` },
    
    UsersAppMappingFactory,
    BookingsMappingFactory,
    FlightsMappingFactory,
    AuthMappingFactory,
    UsersAppRepositoryFactory,
    BookingsRepositoryFactory,
    FlightsRepositoryFactory,
    // Registrar otros repositorios según sea necesario
    // Servicios de aplicación
    {
      provide: 'UsersAppService',
      useClass: UsersAppService
    },
    {
      provide: 'FlightsService',
      useClass: FlightsService
    },
    {
      provide: 'BookingsService',
      useClass: BookingsService
    },
    AuthenticationServiceFactory,
    MediaServiceFactory

    // ... otros proveedores],
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}
