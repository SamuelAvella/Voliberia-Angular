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

//Services
import { BaseRepositoryHttpService } from "./impl/base-repository-http.service";
import { BaseAuthenticationService } from "../services/impl/base-authentication.service";
import { BaseMediaService } from "../services/impl/base-media.service";
  //Strapi
  import { StrapiRepositoryService } from "./impl/strapi-repository.service";
  import { StrapiMediaService } from "../services/impl/strapi-media.service";
  import { StrapiAuthenticationService } from "../services/impl/strapi-authentication.service";
  import { IStrapiAuthentication } from "../services/interfaces/strapi-authentication.interface";

  //Firebase
  import { BaseRepositoryFirebaseService } from './impl/base-repository-firebase.service';
  import { FlightsMappingFirebaseService } from './impl/flights-mapping-firebase.service';
  import { BookingsMappingFirebaseService } from './impl/bookings-mapping-firebase.service';
  import { UsersAppMappingFirebaseService } from './impl/usersApp-mapping-firebase.service';
  import { FirebaseAuthenticationService } from '../services/impl/firebase-authentication.service';
  import { FirebaseAuthMappingService } from '../services/impl/firebase-auth-mapping.service';

//Mapping
import { IAuthMapping } from "../services/interfaces/auth-mapping.interface";
import { IBaseMapping } from "./interfaces/base-mapping.interface";
import { UserAppMappingStrapi } from "./impl/usersApp-mapping-strapi.service";
import { BookingMappingStrapi } from "./impl/bookings-mapping-strapi.service";
import { FlightsMappingStrapi } from "./impl/flights-mapping-strapi.service";
import { StrapiAuthMappingService } from "../services/impl/strapi-auth-mapping.service";

//Tokens
import { AUTH_MAPPING_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, BACKEND_TOKEN, BOOKINGS_API_URL_TOKEN, BOOKINGS_REPOSITORY_MAPPING_TOKEN, BOOKINGS_REPOSITORY_TOKEN, BOOKINGS_RESOURCE_NAME_TOKEN, FLIGHTS_API_URL_TOKEN, FLIGHTS_REPOSITORY_MAPPING_TOKEN, FLIGHTS_REPOSITORY_TOKEN, FLIGHTS_RESOURCE_NAME_TOKEN, UPLOAD_API_URL_TOKEN, USERSAPP_API_URL_TOKEN, USERSAPP_REPOSITORY_MAPPING_TOKEN, USERSAPP_REPOSITORY_TOKEN, USERSAPP_RESOURCE_NAME_TOKEN, FIREBASE_CONFIG_TOKEN } from "./repository.token";

export function createBaseRepositoryFactory<T extends Model>(
    token: InjectionToken<IBaseRepository<T>>,
    dependencies:any[]) : FactoryProvider{

    return {
        provide: token,
        useFactory: (backend: string, http: HttpClient, auth:IStrapiAuthentication, apiURL: string, resource: string, mapping: IBaseMapping<T>, firebaseConfig?: any) => {
            switch(backend){
                case 'http':
                    return new BaseRepositoryHttpService<T>(http, auth, apiURL, resource, mapping);
                case 'strapi':
                    return new StrapiRepositoryService<T>(http, auth, apiURL, resource, mapping);
                case 'firebase':
                    return new BaseRepositoryFirebaseService<T>(firebaseConfig, resource, mapping);
                default:
                    throw new Error("BACKEND NOT IMPLEMENTED");
            }
        },
        deps: dependencies
    };
};

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

export const UsersAppMappingFactory = createBaseMappingFactory<UserApp>(
    USERSAPP_REPOSITORY_MAPPING_TOKEN, 
    [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN],
    'userApp'
);
export const BookingsMappingFactory = createBaseMappingFactory<Booking>(
    BOOKINGS_REPOSITORY_MAPPING_TOKEN, 
    [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN],
    'booking'
);

export const FlightsMappingFactory = createBaseMappingFactory<Flight>(
    FLIGHTS_REPOSITORY_MAPPING_TOKEN, 
    [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN],
    'flight'
);

export const AuthMappingFactory: FactoryProvider = createBaseAuthMappingFactory(AUTH_MAPPING_TOKEN, [BACKEND_TOKEN]);

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

export const MediaServiceFactory:FactoryProvider = {
    provide: BaseMediaService,
    useFactory: (backend:string, firebaseConfig: any, upload:string, auth:IStrapiAuthentication, http:HttpClient) => {
      switch(backend){
        case 'http':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'local-storage':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'json-server':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'firebase':
        case 'strapi':
          return new StrapiMediaService(upload, auth, http);
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
      
    },
    deps: [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN, UPLOAD_API_URL_TOKEN, BaseAuthenticationService, HttpClient]
};
  

export const UsersAppRepositoryFactory: FactoryProvider = createBaseRepositoryFactory<User>(USERSAPP_REPOSITORY_TOKEN,
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

export const BookingsRepositoryFactory: FactoryProvider = createBaseRepositoryFactory<Booking>(
  BOOKINGS_REPOSITORY_TOKEN,
  [
    BACKEND_TOKEN,
    HttpClient,
    BaseAuthenticationService,
    BOOKINGS_API_URL_TOKEN,
    BOOKINGS_RESOURCE_NAME_TOKEN,
    BOOKINGS_REPOSITORY_MAPPING_TOKEN,
    FIREBASE_CONFIG_TOKEN
  ]
);


export const FlightsRepositoryFactory: FactoryProvider = createBaseRepositoryFactory<Flight>(FLIGHTS_REPOSITORY_TOKEN,
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

