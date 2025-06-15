import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { TranslateModule,TranslateLoader } from '@ngx-translate/core';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

import { SharedModule } from './shared/shared.module';
import { AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, BACKEND_TOKEN, BOOKINGS_API_URL_TOKEN, BOOKINGS_RESOURCE_NAME_TOKEN, FLIGHTS_API_URL_TOKEN, FLIGHTS_RESOURCE_NAME_TOKEN, STRAPI_AUTH_TOKEN, UPLOAD_API_URL_TOKEN, USERSAPP_API_URL_TOKEN, USERSAPP_RESOURCE_NAME_TOKEN, FIREBASE_CONFIG_TOKEN } from './core/repositories/repository.token';
import { environment } from 'src/environments/environment';

//Services
import { UsersAppService } from './core/services/impl/usersApp.service';
import { FlightsService } from './core/services/impl/flights.service';
import { BookingsService } from './core/services/impl/bookings.service';
import { StrapiAuthenticationService } from './core/services/impl/strapi-authentication.service';

//Factory
import { AuthenticationServiceFactory, AuthMappingFactory, BookingsMappingFactory, BookingsRepositoryFactory, FlightsRepositoryFactory, FlightsMappingFactory, MediaServiceFactory, UsersAppMappingFactory, UsersAppRepositoryFactory } from './core/repositories/repository.factory';
import { FlightsCollectionSubscriptionFactory, BookingsCollectionSubscriptionFactory } from './core/repositories/repository.factory';
import { CalendarModule, DatePickerModule, TimePickerModule, DateRangePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';

/**
 * Función auxiliar para crear el loader de traducción con ngx-translate.
 * @param http Cliente HTTP
 * @returns Cargador de traducciones
 */
export function createTranslateLoader(http: HttpClient){
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

/**
 * Módulo principal de la aplicación.
 * Declara e importa todos los módulos necesarios y registra servicios globales.
 */
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
    SharedModule,
    CalendarModule, DatePickerModule, TimePickerModule, DateRangePickerModule, DateTimePickerModule,
  ],
  providers: [
    { provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    provideLottieOptions({
      player:() => player,
    }),
    
    /** Tokens de configuración y servicios personalizados */
    provideHttpClient(),
    { provide: BACKEND_TOKEN, useValue: 'firebase' },
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
    { provide: FIREBASE_CONFIG_TOKEN, useValue:
      {
        apiKey: "AIzaSyAH7qPi9Hh7yUJXUuL0-RAKBQRZWbdcswQ",
        authDomain: "voliberia-c2248.firebaseapp.com",
        projectId: "voliberia-c2248",
        storageBucket: "voliberia-c2248.firebasestorage.app",
        messagingSenderId: "4884367469",
        appId: "1:4884367469:web:9e6415b64229d44057d764",
        measurementId: "G-HFMKX3HBVS"
      }
    },

    /** Fábricas de mapeo y repositorios */
    UsersAppMappingFactory,
    BookingsMappingFactory,
    FlightsMappingFactory,
    AuthMappingFactory,
    UsersAppRepositoryFactory,
    BookingsRepositoryFactory,
    FlightsRepositoryFactory,
    
    /** Servicios de aplicación */
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
    {
      provide: STRAPI_AUTH_TOKEN,
      useClass: StrapiAuthenticationService // Or the exact service this interface implements
    },

    AuthenticationServiceFactory,
    MediaServiceFactory,
    FlightsCollectionSubscriptionFactory,
    BookingsCollectionSubscriptionFactory

    // ... other providers],
  ],
  bootstrap: [
    AppComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
