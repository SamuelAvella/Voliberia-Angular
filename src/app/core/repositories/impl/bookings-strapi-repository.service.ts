import { Inject, Injectable } from "@angular/core";
import { StrapiRepositoryService } from "./strapi-repository.service";
import { Booking } from "../../models/booking.model";
import { IBookingsRepository } from "../interfaces/bookings-repository.interface";
import { BOOKINGS_API_URL_TOKEN, BOOKINGS_REPOSITORY_MAPPING_TOKEN, BOOKINGS_RESOURCE_NAME_TOKEN, STRAPI_AUTH_TOKEN } from "../repository.token";
import { HttpClient } from "@angular/common/http";
import { IStrapiAuthentication } from "../../services/interfaces/strapi-authentication.interface";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
  })
  export class BookingsStrapiRepositoryService extends StrapiRepositoryService<Booking> implements IBookingsRepository
  {
    constructor(
      http: HttpClient,
      @Inject(STRAPI_AUTH_TOKEN) override auth: IStrapiAuthentication,
      @Inject(BOOKINGS_API_URL_TOKEN) apiUrl: string, 
      @Inject(BOOKINGS_RESOURCE_NAME_TOKEN) resource: string,
      @Inject(BOOKINGS_REPOSITORY_MAPPING_TOKEN) mapping: IBaseMapping<Booking>
    ) {
      super(http, auth, apiUrl, resource, mapping);
    }
    
    deleteBookingsByFlightId(flightId: string): Observable<void> {
      const url = `${this.apiUrl}/${this.resource}?filters[flight][id][$eq]=${flightId}`;
      return this.http.get<{ data: { id: string }[] }>(url, this.getHeaders()).pipe(
        map((response) => response.data.map((booking) => booking.id)),
        map((ids) => {
          ids.forEach((id) => {
            this.http.delete<void>(`${this.apiUrl}/${this.resource}/${id}`, this.getHeaders()).subscribe();
          });
        }),
        map(() => undefined) // Retornamos `undefined` ya que no necesitamos respuesta
      );
    };
    

  }
  