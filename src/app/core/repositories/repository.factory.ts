import { FactoryProvider, InjectionToken, model } from "@angular/core";
import { Model } from "../models/base.model";
import { IBaseRepository } from "./interfaces/base-repository.interface";
import { HttpClient } from "@angular/common/http";
import { IBaseMapping } from "./interfaces/base-mapping.interface";
import { BaseRepositoryHttpService } from "./impl/base-repository-http.service";
import { StrapiRepositoryService } from "./impl/strapi-repository.service";
import { IStrapiAuthentication } from "../services/interfaces/strapi-authentication.interface";
import { UserAppMappingStrapi } from "./impl/usersApp-mapping-strapi.service";
import { BookingMappingStrapi } from "./impl/bookings-mapping-strapi.service";
import { FlightsMappingStrapi } from "./impl/flights-mapping-strapi.service";
import { StrapiAuthMappingService } from "../services/impl/strapi-auth-mapping.service";
import { UserApp } from "../models/userApp.model";
import { AUTH_MAPPING_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, BACKEND_TOKEN, BOOKINGS_API_URL_TOKEN, BOOKINGS_REPOSITORY_MAPPING_TOKEN, BOOKINGS_REPOSITORY_TOKEN, BOOKINGS_RESOURCE_NAME_TOKEN, FLIGHTS_API_URL_TOKEN, FLIGHTS_REPOSITORY_MAPPING_TOKEN, FLIGHTS_REPOSITORY_TOKEN, FLIGHTS_RESOURCE_NAME_TOKEN, UPLOAD_API_URL_TOKEN, USERSAPP_API_URL_TOKEN, USERSAPP_REPOSITORY_MAPPING_TOKEN, USERSAPP_REPOSITORY_TOKEN, USERSAPP_RESOURCE_NAME_TOKEN } from "./repository.token";
import { Booking } from "../models/booking.model";
import { Flight } from "../models/flight.model";
import { BaseAuthenticationService } from "../services/impl/base-authentication.service";
import { IAuthMapping } from "../services/interfaces/auth-mapping.interface";
import { StrapiAuthenticationService } from "../services/impl/strapi-authentication.service";
import { BaseMediaService } from "../services/impl/base-media.service";
import { StrapiMediaService } from "../services/impl/strapi-media.service";
import { User } from "../models/auth.model";

export function createBaseRepositoryFactory<T extends Model>(
    token: InjectionToken<IBaseRepository<T>>,
    dependencies:any[]) : FactoryProvider{

    return {
        provide: token,
        useFactory: (backend: string, http: HttpClient, auth:IStrapiAuthentication, apiURL: string, resource: string, mapping: IBaseMapping<T>) => {
            switch(backend){
                case 'http':
                    return new BaseRepositoryHttpService<T>(http, auth, apiURL, resource, mapping);
                case 'strapi':
                    return new StrapiRepositoryService<T>(http, auth, apiURL, resource, mapping);
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
        useFactory: (backend: string) => {
            switch (backend) {
              case 'strapi':
                return modelType === 'userApp'
                    ? new UserAppMappingStrapi() :(
                    modelType === 'booking' 
                    ? new BookingMappingStrapi() :(
                    modelType === 'flight' 
                    ? new FlightsMappingStrapi() : null));
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
            default:
            throw new Error("BACKEND NOT IMPLEMENTED");
        }
        },
        deps: dependencies
    };
};

export const UsersAppMappingFactory = createBaseMappingFactory<UserApp>(
    USERSAPP_REPOSITORY_MAPPING_TOKEN, 
    [BACKEND_TOKEN],
    'userApp'
);
export const BookingsMappingFactory = createBaseMappingFactory<Booking>(
    BOOKINGS_REPOSITORY_MAPPING_TOKEN, 
    [BACKEND_TOKEN],
    'booking'
);

export const FlightsMappingFactory = createBaseMappingFactory<Flight>(
    FLIGHTS_REPOSITORY_MAPPING_TOKEN, 
    [BACKEND_TOKEN],
    'flight'
);

export const AuthMappingFactory: FactoryProvider = createBaseAuthMappingFactory(AUTH_MAPPING_TOKEN, [BACKEND_TOKEN]);

export const AuthenticationServiceFactory:FactoryProvider = {
    provide: BaseAuthenticationService,
    useFactory: (backend:string, signIn:string, signUp:string, meUrl:string, mapping:IAuthMapping, http:HttpClient) => {
      switch(backend){
        case 'http':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'local-storage':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'json-server':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'strapi':
          return new StrapiAuthenticationService(signIn, signUp, meUrl, mapping, http);
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
      
    },
    deps: [BACKEND_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_MAPPING_TOKEN, HttpClient]
};

export const MediaServiceFactory:FactoryProvider = {
    provide: BaseMediaService,
    useFactory: (backend:string, upload:string, auth:IStrapiAuthentication, http:HttpClient) => {
      switch(backend){
        case 'http':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'local-storage':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'json-server':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'strapi':
          return new StrapiMediaService(upload, auth, http);
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
      
    },
    deps: [BACKEND_TOKEN, UPLOAD_API_URL_TOKEN, BaseAuthenticationService, HttpClient]
};
  

export const UsersAppRepositoryFactory: FactoryProvider = createBaseRepositoryFactory<User>(USERSAPP_REPOSITORY_TOKEN,
    [BACKEND_TOKEN, HttpClient, BaseAuthenticationService, USERSAPP_API_URL_TOKEN, USERSAPP_RESOURCE_NAME_TOKEN, USERSAPP_REPOSITORY_MAPPING_TOKEN]
);

export const BookingsRepositoryFactory: FactoryProvider = createBaseRepositoryFactory<Booking>(BOOKINGS_REPOSITORY_TOKEN,
    [BACKEND_TOKEN, HttpClient, BaseAuthenticationService, BOOKINGS_API_URL_TOKEN, BOOKINGS_RESOURCE_NAME_TOKEN, BOOKINGS_REPOSITORY_MAPPING_TOKEN]
);

export const FlightsRepositoryFactory: FactoryProvider = createBaseRepositoryFactory<Flight>(FLIGHTS_REPOSITORY_TOKEN,
    [BACKEND_TOKEN, HttpClient, BaseAuthenticationService, FLIGHTS_API_URL_TOKEN, FLIGHTS_RESOURCE_NAME_TOKEN, FLIGHTS_REPOSITORY_MAPPING_TOKEN]
);