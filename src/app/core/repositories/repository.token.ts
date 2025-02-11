import { Inject, InjectionToken } from "@angular/core";

import { IBaseMapping } from "./interfaces/base-mapping.interface";

//Models
import { UserApp } from "../models/userApp.model";
import { Booking } from "../models/booking.model";
import { Flight } from "../models/flight.model";
//import { Seat } from "../models/seat.model.ts.backup";

//Repositories
import { IBaseRepository } from "./interfaces/base-repository.interface";
import { IBookingsRepository } from "./interfaces/bookings-repository.interface";
import { IFlightsRepository } from "./interfaces/flights-repository.interface";
//import { ISeatsRepository } from "./interfaces/seats-repository.interface.ts.backup";
import { IUsersAppRepository } from "./interfaces/usersApp-repository.interface";


//Authentication
import { IAuthentication } from "../services/interfaces/authentication.interface";
import { IStrapiAuthentication } from "../services/interfaces/strapi-authentication.interface";

//Resources and repositories
export const RESOURCE_NAME_TOKEN = new InjectionToken<String>('ResourceName');
export const BOOKINGS_RESOURCE_NAME_TOKEN = new InjectionToken<String>('BookingsResourceName');
export const FLIGHTS_RESOURCE_NAME_TOKEN = new InjectionToken<String>('FlightsResourceName');
//export const SEAT_RESOURCE_NAME_TOKEN = new InjectionToken<String>('SeatsResourceName');
export const USERSAPP_RESOURCE_NAME_TOKEN = new InjectionToken<String>('UsersAppResourceName');

export const REPOSITORY_TOKEN = new InjectionToken<IBaseRepository<any>>('REPOSITORY_TOKEN');
export const BOOKINGS_REPOSITORY_TOKEN = new InjectionToken<IBookingsRepository>('IBookingsRepository');
export const FLIGHTS_REPOSITORY_TOKEN = new InjectionToken<IFlightsRepository>('IFlightsRepository');
//export const SEATS_REPOSITORY_TOKEN = new InjectionToken<ISeatsRepository>('ISeatsRepository');
export const USERSAPP_REPOSITORY_TOKEN = new InjectionToken<IUsersAppRepository>('IUsersAppRepository');

//Api URL
export const API_URL_TOKEN = new InjectionToken<string>('ApiUrl');
export const BOOKINGS_API_URL_TOKEN = new InjectionToken<string>('BookingsApiUrl');
export const FLIGHTS_API_URL_TOKEN = new InjectionToken<string>('FlightsApiUrl');
//export const SEATS_API_URL_TOKEN = new InjectionToken<string>('SeatsApiUrl');
export const USERSAPP_API_URL_TOKEN = new InjectionToken<string>('UsersAppApiUrl');
export const AUTH_SIGN_IN_API_URL_TOKEN = new InjectionToken<string>('AuthSignInApiUrl'); //TODO For guard implementation
export const AUTH_SIGN_UP_API_URL_TOKEN = new InjectionToken<string>('AuthSignUpApiUrl'); //TODO For guard implementation
export const AUTH_ME_API_URL_TOKEN = new InjectionToken<string>('AuthMeApiUrl'); //TODO For guard implementation
export const UPLOAD_API_URL_TOKEN = new InjectionToken<string>('UploadApiUrl');

//Mapping
export const REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<any>>('IBaseRepositoryMapping');
export const BOOKINGS_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Booking>>('IBaseRepositoryMapping');
export const FLIGHTS_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Flight>>('IBaseRepositoryMapping');
//export const SEATS_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Seat>>('IBaseRepositoryMapping');
export const USERSAPP_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<UserApp>>('IBaseRepositoryMapping');
export const AUTH_TOKEN = new InjectionToken<IAuthentication>('IAuthentication');
export const STRAPI_AUTH_TOKEN = new InjectionToken<IStrapiAuthentication>('IStrapiAuthentication');
export const AUTH_MAPPING_TOKEN = new InjectionToken<IBaseMapping<UserApp>>('IAuthMapping');
export const BACKEND_TOKEN = new InjectionToken<string>('Backend'); //TODO For firebase implementation
