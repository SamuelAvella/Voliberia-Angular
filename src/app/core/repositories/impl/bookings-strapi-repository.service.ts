import { Inject, Injectable } from "@angular/core";
import { StrapiRepositoryService } from "./strapi-repository.service";
import { Booking } from "../../models/booking.model";
import { IBookingsRepository } from "../interfaces/bookings-repository.interface";
import { BOOKINGS_API_URL_TOKEN, BOOKINGS_REPOSITORY_MAPPING_TOKEN, BOOKINGS_RESOURCE_NAME_TOKEN, STRAPI_AUTH_TOKEN } from "../repository.token";
import { HttpClient } from "@angular/common/http";
import { IStrapiAuthentication } from "../../services/interfaces/strapi-authentication.interface";
import { IBaseMapping } from "../interfaces/base-mapping.interface";

@Injectable({
    providedIn: 'root',
  })
  export class BookingsStrapiRepositoryService
    extends StrapiRepositoryService<Booking>
    implements IBookingsRepository
  {
    constructor(
      http: HttpClient,
      @Inject(STRAPI_AUTH_TOKEN) override auth: IStrapiAuthentication,
      @Inject(BOOKINGS_API_URL_TOKEN) apiUrl: string, // URL base de la API para el modelo
      @Inject(BOOKINGS_RESOURCE_NAME_TOKEN) resource: string, // nombre del recurso del repositorio
      @Inject(BOOKINGS_REPOSITORY_MAPPING_TOKEN) mapping: IBaseMapping<Booking>
    ) {
      super(http, auth, apiUrl, resource, mapping);
    }
    
    

  }
  