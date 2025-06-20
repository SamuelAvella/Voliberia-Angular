/**
 * @file repository.factory.ts
 * @description Factorías para crear dinámicamente servicios de repositorio, mapeo y autenticación, compatibles con múltiples backends.
 */


import { FactoryProvider, InjectionToken, model } from "@angular/core";
import { HttpClient } from "@angular/common/http";

//Models
import { Model } from "../models/base.model";
import { Booking } from "../models/booking.model";
import { Flight } from "../models/flight.model";
import { UserApp } from "../models/userApp.model";
import { User } from "../models/auth.model";

//Repositories
import { IBaseRepository } from "./interfaces/base-repository.interface";
import { StrapiRepositoryService } from "./impl/strapi-repository.service";
  import { BookingsStrapiRepositoryService } from "./impl/bookings-strapi-repository.service";

import { FirebaseRepositoryService } from './impl/firebase-repository.service';
  import { BookingsFirebaseRepositoryService } from "./impl/bookings-firebase-repository.service";

//Services
import { BaseRepositoryHttpService } from "./impl/base-repository-http.service";
import { BaseAuthenticationService } from "../services/impl/base-authentication.service";
import { BaseMediaService } from "../services/impl/base-media.service";
  //Strapi
  import { StrapiMediaService } from "../services/impl/strapi-media.service";
  import { StrapiAuthenticationService } from "../services/impl/strapi-authentication.service";
  import { IStrapiAuthentication } from "../services/interfaces/strapi-authentication.interface";

  //Firebase
  import { FirebaseAuthenticationService } from '../services/impl/firebase-authentication.service';
  import { FirebaseMediaService } from "../services/impl/firebase-media.service";

//Mapping
import { IAuthMapping } from "../services/interfaces/auth-mapping.interface";
import { IBaseMapping } from "./interfaces/base-mapping.interface";

  //Strapi
  import { UserAppMappingStrapi } from "./impl/usersApp-mapping-strapi.service";
  import { BookingMappingStrapi } from "./impl/bookings-mapping-strapi.service";
  import { FlightsMappingStrapi } from "./impl/flights-mapping-strapi.service";
  import { StrapiAuthMappingService } from "../services/impl/strapi-auth-mapping.service";

  //Firebase
  import { FlightsMappingFirebaseService } from './impl/flights-mapping-firebase.service';
  import { BookingsMappingFirebaseService } from './impl/bookings-mapping-firebase.service';
  import { UsersAppMappingFirebaseService } from './impl/usersApp-mapping-firebase.service';
  import { FirebaseAuthMappingService } from '../services/impl/firebase-auth-mapping.service';

//Tokens
import { IAuthentication } from "../services/interfaces/authentication.interface";

import { AUTH_MAPPING_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, BACKEND_TOKEN, BOOKINGS_API_URL_TOKEN, BOOKINGS_REPOSITORY_MAPPING_TOKEN, BOOKINGS_REPOSITORY_TOKEN, BOOKINGS_RESOURCE_NAME_TOKEN, FLIGHTS_API_URL_TOKEN, FLIGHTS_REPOSITORY_MAPPING_TOKEN, FLIGHTS_REPOSITORY_TOKEN, FLIGHTS_RESOURCE_NAME_TOKEN, UPLOAD_API_URL_TOKEN, USERSAPP_API_URL_TOKEN, USERSAPP_REPOSITORY_MAPPING_TOKEN, USERSAPP_REPOSITORY_TOKEN, USERSAPP_RESOURCE_NAME_TOKEN, FIREBASE_CONFIG_TOKEN, FLIGHTS_COLLECTION_SUBSCRIPTION_TOKEN, BOOKINGS_COLLECTION_SUBSCRIPTION_TOKEN } from "./repository.token";
import { collection } from "firebase/firestore";
import { FirebaseCollectionSubscriptionService } from '../services/impl/firebase-collection-subscription.service';
import { ICollectionSubscription } from '../services/interfaces/collection-subscription.interface';

/**
 * Crea una factoría para un repositorio genérico dependiendo del backend.
 *
 * @param token - Token de inyección asociado al repositorio.
 * @param dependencies - Dependencias necesarias para el repositorio.
 * @returns FactoryProvider para el repositorio.
 */
export function createBaseRepositoryFactory<T extends Model>(
    token: InjectionToken<IBaseRepository<T>>,
    dependencies:any[]) : FactoryProvider{

    return {
        provide: token,
        useFactory: (backend: string, http: HttpClient, auth:IStrapiAuthentication, apiURL: string, resource: string, mapping: IBaseMapping<any>, firebaseConfig?: any) => {
            switch(backend){
                case 'http':
                    return new BaseRepositoryHttpService<T>(http, auth, apiURL, resource, mapping);
                case 'strapi':
                  switch(resource){
                    case 'bookings':
                      return new BookingsStrapiRepositoryService(http, auth, apiURL, resource, mapping);
                    default:
                    return new StrapiRepositoryService<T>(http, auth, apiURL, resource, mapping);

                  }
                case 'firebase':
                  switch(resource){
                    case 'bookings':
                      return new BookingsFirebaseRepositoryService(firebaseConfig, resource, mapping);
                    default:
                      return new FirebaseRepositoryService<T>(firebaseConfig, resource, mapping);
                  }
                default:
                    throw new Error("BACKEND NOT IMPLEMENTED");
            }
        },
        deps: dependencies
    };
};

/**
 * Crea una factoría para un mapeador genérico (por modelo).
 *
 * @param token - Token de inyección asociado al mapeador.
 * @param dependencies - Dependencias necesarias.
 * @param modelType - Tipo de modelo: 'userApp', 'booking' o 'flight'.
 * @returns FactoryProvider para el mapeador.
 */
export function createBaseMappingFactory<T extends Model>(
    token: InjectionToken<IBaseMapping<T>>,
    dependencies: any[],
    modelType: 'userApp' | 'booking' | 'flight'
): FactoryProvider {
    return {
        provide: token,
        useFactory: (backend: string, firebaseConfig?: any) => {
            switch (backend) {
              case 'strapi':
                return modelType === 'userApp'
                    ? new UserAppMappingStrapi() :(
                    modelType === 'booking'
                    ? new BookingMappingStrapi() :(
                    modelType === 'flight'
                    ? new FlightsMappingStrapi() : null));
              case 'firebase':
                return modelType === 'userApp'
                    ? new UsersAppMappingFirebaseService(firebaseConfig) :(
                    modelType === 'booking'
                    ? new BookingsMappingFirebaseService(firebaseConfig) :(
                    modelType === 'flight'
                    ? new FlightsMappingFirebaseService(firebaseConfig) : null));
              default:
                throw new Error("BACKEND NOT IMPLEMENTED");
            }
        },
        deps: dependencies
    };
};

/**
 * Crea una factoría para el mapeador de autenticación.
 *
 * @param token - Token de inyección asociado al mapeador de autenticación.
 * @param dependencies - Dependencias necesarias.
 * @returns FactoryProvider para el mapeador de autenticación.
 */
export function createBaseAuthMappingFactory(token: InjectionToken<IAuthMapping>, dependencies:any[]): FactoryProvider {
    return {
        provide: token,
        useFactory: (backend: string) => {
        switch (backend) {
            case 'http':
              throw new Error("BACKEND NOT IMPLEMENTED");
            case 'local-storage':
              throw new Error("BACKEND NOT IMPLEMENTED");
            case 'json-server':
              throw new Error("BACKEND NOT IMPLEMENTED");
            case 'strapi':
              return new StrapiAuthMappingService();
            case 'firebase':
              return new FirebaseAuthMappingService();
            default:
              throw new Error("BACKEND NOT IMPLEMENTED");
        }
        },
        deps: dependencies
    };
};

/**
 * Factoría para el mapeador de UserApp.
 */
export const UsersAppMappingFactory = createBaseMappingFactory<UserApp>(
    USERSAPP_REPOSITORY_MAPPING_TOKEN,
    [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN],
    'userApp'
);

/**
 * Factoría para el mapeador de Booking.
 */
export const BookingsMappingFactory = createBaseMappingFactory<Booking>(
    BOOKINGS_REPOSITORY_MAPPING_TOKEN,
    [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN],
    'booking'
);

/**
 * Factoría para el mapeador de Flight.
 */
export const FlightsMappingFactory = createBaseMappingFactory<Flight>(
    FLIGHTS_REPOSITORY_MAPPING_TOKEN,
    [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN],
    'flight'
);


/**
 * Factoría para el mapeador de autenticación.
 */
export const AuthMappingFactory: FactoryProvider = createBaseAuthMappingFactory(AUTH_MAPPING_TOKEN, [BACKEND_TOKEN]);

/**
 * Factoría para el servicio de autenticación.
 */
export const AuthenticationServiceFactory:FactoryProvider = {
    provide: BaseAuthenticationService,
    useFactory: (backend:string, firebaseConfig: any, signIn:string, signUp:string, meUrl:string, mapping:IAuthMapping, http:HttpClient) => {
      switch(backend){
        case 'http':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'local-storage':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'json-server':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'strapi':
          return new StrapiAuthenticationService(signIn, signUp, meUrl, mapping, http);
        case 'firebase':
          return new FirebaseAuthenticationService(firebaseConfig, mapping);
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }

    },
    deps: [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_MAPPING_TOKEN, HttpClient]
};

/**
 * Factoría para el servicio de subida de ficheros.
 */
export const MediaServiceFactory:FactoryProvider = {
    provide: BaseMediaService,
    useFactory: (backend:string, firebaseConfig: any, upload:string, auth:IAuthentication, http:HttpClient) => {
      switch(backend){
        case 'http':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'local-storage':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'json-server':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'firebase':
          return new FirebaseMediaService(firebaseConfig, auth)
        case 'strapi':
          return new StrapiMediaService(upload, auth as IStrapiAuthentication, http);
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }

    },
    deps: [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN, UPLOAD_API_URL_TOKEN, BaseAuthenticationService, HttpClient]
};

/**
 * Factoría para el repositorio de usuarios (UserApp).
 */
export const UsersAppRepositoryFactory: FactoryProvider = createBaseRepositoryFactory<User>(
  USERSAPP_REPOSITORY_TOKEN,
    [
      BACKEND_TOKEN,
      HttpClient,
      BaseAuthenticationService,
      USERSAPP_API_URL_TOKEN,
      USERSAPP_RESOURCE_NAME_TOKEN,
      USERSAPP_REPOSITORY_MAPPING_TOKEN,
      FIREBASE_CONFIG_TOKEN
    ]
);

/**
 * Factoría para el repositorio de reservas (Booking).
 */
export const BookingsRepositoryFactory: FactoryProvider = createBaseRepositoryFactory<Booking>(
  BOOKINGS_REPOSITORY_TOKEN,
  [
    BACKEND_TOKEN,
    HttpClient,
    BaseAuthenticationService,
    BOOKINGS_API_URL_TOKEN,
    BOOKINGS_RESOURCE_NAME_TOKEN,
    BOOKINGS_REPOSITORY_MAPPING_TOKEN,
    FIREBASE_CONFIG_TOKEN,
  ]
);

/**
 * Factoría para el repositorio de vuelos (Flight).
 */
export const FlightsRepositoryFactory: FactoryProvider = createBaseRepositoryFactory<Flight>(
  FLIGHTS_REPOSITORY_TOKEN,
    [
      BACKEND_TOKEN,
      HttpClient,
      BaseAuthenticationService,
      FLIGHTS_API_URL_TOKEN,
      FLIGHTS_RESOURCE_NAME_TOKEN,
      FLIGHTS_REPOSITORY_MAPPING_TOKEN,
      FIREBASE_CONFIG_TOKEN
    ]
);

/**
 * Crea una factoría para suscripción a colecciones Firebase.
 *
 * @param collectionName - Nombre de la colección.
 * @param mappingToken - Token del mapeador asociado.
 * @param collectionSubscriptionToken - Token de suscripción.
 * @returns FactoryProvider para la suscripción.
 */
export function createCollectionSubscriptionFactory<T extends Model>(
  collectionName: string,
  mappingToken: InjectionToken<IBaseMapping<T>>,
  collectionSubscriptionToken: InjectionToken<ICollectionSubscription<T>>
): FactoryProvider {
  return {
    provide: collectionSubscriptionToken,
    useFactory: (backend: string, firebaseConfig: any, mapping: IBaseMapping<T>) => {
      switch (backend) {
        case 'firebase':
          return new FirebaseCollectionSubscriptionService<T>(firebaseConfig, mapping);
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
    },
    deps: [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN, mappingToken]
  };
}

/**
 * Suscripción en tiempo real a la colección de vuelos.
 */
export const FlightsCollectionSubscriptionFactory = createCollectionSubscriptionFactory<Flight>(
  'fligths',
  FLIGHTS_REPOSITORY_MAPPING_TOKEN,
  FLIGHTS_COLLECTION_SUBSCRIPTION_TOKEN
);

/**
 * Suscripción en tiempo real a la colección de reservas.
 */
export const BookingsCollectionSubscriptionFactory = createCollectionSubscriptionFactory<Booking>(
  'bookings',
  BOOKINGS_REPOSITORY_MAPPING_TOKEN,
  BOOKINGS_COLLECTION_SUBSCRIPTION_TOKEN
);
