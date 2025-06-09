/**
 * @file repository.token.ts
 * @description Tokens de inyección para recursos, URLs, repositorios, mapeos, autenticación y Firebase.
 */


import { Inject, InjectionToken } from "@angular/core";


//Models
import { UserApp } from "../models/userApp.model";
import { Booking } from "../models/booking.model";
import { Flight } from "../models/flight.model";

//Repositories
import { IBaseRepository } from "./interfaces/base-repository.interface";
import { IBookingsRepository } from "./interfaces/bookings-repository.interface";
import { IFlightsRepository } from "./interfaces/flights-repository.interface";
import { IUsersAppRepository } from "./interfaces/usersApp-repository.interface";


//Authentication
import { IAuthentication } from "../services/interfaces/authentication.interface";
import { IStrapiAuthentication } from "../services/interfaces/strapi-authentication.interface";
import { ICollectionSubscription } from "../services/interfaces/collection-subscription.interface";
import { Model } from "../models/base.model";
import { IBaseMapping } from "./interfaces/base-mapping.interface";


/**
 * Token para el nombre genérico del recurso.
 */
export const RESOURCE_NAME_TOKEN = new InjectionToken<String>('ResourceName');

/**
 * Token para el recurso de reservas.
 */
export const BOOKINGS_RESOURCE_NAME_TOKEN = new InjectionToken<String>('BookingsResourceName');

/**
 * Token para el recurso de vuelos.
 */
export const FLIGHTS_RESOURCE_NAME_TOKEN = new InjectionToken<String>('FlightsResourceName');

/**
 * Token para el recurso de usuarios.
 */
export const USERSAPP_RESOURCE_NAME_TOKEN = new InjectionToken<String>('UsersAppResourceName');

/**
 * Token genérico de repositorio.
 */
export const REPOSITORY_TOKEN = new InjectionToken<IBaseRepository<any>>('REPOSITORY_TOKEN');

/**
 * Token para el repositorio de reservas.
 */
export const BOOKINGS_REPOSITORY_TOKEN = new InjectionToken<IBookingsRepository>('IBookingsRepository');

/**
 * Token para el repositorio de vuelos.
 */
export const FLIGHTS_REPOSITORY_TOKEN = new InjectionToken<IFlightsRepository>('IFlightsRepository');

/**
 * Token para el repositorio de usuarios.
 */
export const USERSAPP_REPOSITORY_TOKEN = new InjectionToken<IUsersAppRepository>('IUsersAppRepository');

/**
 * Token genérico para la URL de la API.
 */
export const API_URL_TOKEN = new InjectionToken<string>('ApiUrl');

/**
 * Token para la URL de la API de reservas.
 */
export const BOOKINGS_API_URL_TOKEN = new InjectionToken<string>('BookingsApiUrl');

/**
 * Token para la URL de la API de vuelos.
 */
export const FLIGHTS_API_URL_TOKEN = new InjectionToken<string>('FlightsApiUrl');

/**
 * Token para la URL de la API de usuarios.
 */
export const USERSAPP_API_URL_TOKEN = new InjectionToken<string>('UsersAppApiUrl');

/**
 * Token para la URL de login.
 */
export const AUTH_SIGN_IN_API_URL_TOKEN = new InjectionToken<string>('AuthSignInApiUrl');

/**
 * Token para la URL de registro.
 */
export const AUTH_SIGN_UP_API_URL_TOKEN = new InjectionToken<string>('AuthSignUpApiUrl');

/**
 * Token para la URL del usuario autenticado.
 */
export const AUTH_ME_API_URL_TOKEN = new InjectionToken<string>('AuthMeApiUrl');

/**
 * Token para la URL de subida de ficheros.
 */
export const UPLOAD_API_URL_TOKEN = new InjectionToken<string>('UploadApiUrl');

/**
 * Token genérico para mapeo de repositorios.
 */
export const REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<any>>('IBaseRepositoryMapping');

/**
 * Token para el mapeador de reservas.
 */
export const BOOKINGS_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Booking>>('IBaseRepositoryMapping');

/**
 * Token para el mapeador de vuelos.
 */
export const FLIGHTS_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Flight>>('IBaseRepositoryMapping');

/**
 * Token para el mapeador de usuarios.
 */
export const USERSAPP_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<UserApp>>('IBaseRepositoryMapping');

/**
 * Token para el servicio de autenticación.
 */
export const AUTH_TOKEN = new InjectionToken<IAuthentication>('IAuthentication');

/**
 * Token para el mapeador de autenticación.
 */
export const AUTH_MAPPING_TOKEN = new InjectionToken<IBaseMapping<UserApp>>('IAuthMapping');

/**
 * Token específico para autenticación con Strapi.
 */
export const STRAPI_AUTH_TOKEN = new InjectionToken<IStrapiAuthentication>('IStrapiAuthentication');

/**
 * Token para el backend seleccionado ('firebase', 'strapi', etc.).
 */
export const BACKEND_TOKEN = new InjectionToken<string>('Backend');

/**
 * Token de configuración de Firebase.
 */
export const FIREBASE_CONFIG_TOKEN = new InjectionToken<any>('FIREBASE_CONFIG_TOKEN');

/**
 * Token de nombre de colección Firebase.
 */
export const FIREBASE_COLLECTION_TOKEN = new InjectionToken<string>('FIREBASE_COLLECTION_TOKEN');

/**
 * Token genérico para subscripción a colección en Firebase.
 */
export const COLLECTION_SUBSCRIPTION_TOKEN = new InjectionToken<ICollectionSubscription<Model>>('CollectionSubscriptionToken');

/**
 * Token de subscripción para la colección de vuelos.
 */
export const FLIGHTS_COLLECTION_SUBSCRIPTION_TOKEN = new InjectionToken<ICollectionSubscription<Flight>>('FlightsCollectionSubscriptionToken');

/**
 * Token de subscripción para la colección de reservas.
 */
export const BOOKINGS_COLLECTION_SUBSCRIPTION_TOKEN = new InjectionToken<ICollectionSubscription<Booking>>('BookingsCollectionSubscriptionToken');
