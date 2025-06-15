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
export class BookingsStrapiRepositoryService extends StrapiRepositoryService<Booking> implements IBookingsRepository  {

  /**
   * Constructor que inyecta dependencias específicas para bookings en Strapi.
   *
   * @param http Cliente HTTP Angular
   * @param auth Servicio de autenticación con Strapi
   * @param apiUrl URL base de la API de bookings
   * @param resource Nombre del recurso (`bookings`)
   * @param mapping Servicio de mapeo para la entidad `Booking`
   */
  constructor(
    http: HttpClient,
    @Inject(STRAPI_AUTH_TOKEN) override auth: IStrapiAuthentication,
    @Inject(BOOKINGS_API_URL_TOKEN) override apiUrl: string,
    @Inject(BOOKINGS_RESOURCE_NAME_TOKEN) override resource: string,
    @Inject(BOOKINGS_REPOSITORY_MAPPING_TOKEN) mapping: IBaseMapping<Booking>
  ) {
    super(http, auth, apiUrl, resource, mapping);
  }

  /**
   * Elimina todas las reservas (bookings) asociadas a un vuelo específico.
   * Implementa un borrado en cascada mediante múltiples peticiones DELETE.
   *
   * @param flightId ID del vuelo del que se desean eliminar las reservas
   * @returns Observable vacío cuando se completa el proceso
   */
  deleteBookingsByFlightId(flightId: string): Observable<void> {
    const url = `${this.apiUrl}/${this.resource}?filters[flight][id][$eq]=${flightId}`;
    console.log("Delete on cascade de Booking Strapi Repository Service")
    return this.http.get<{ data: { id: string }[] }>(url, this.getHeaders()).pipe(
      map((response) => response.data.map((booking) => booking.id)),
      map((ids) => {
        ids.forEach((id) => {
          this.http.delete<void>(`${this.apiUrl}/${this.resource}/${id}`, this.getHeaders()).subscribe();
        });
      }),
      map(() => undefined) // Return `undefined` since we don't need answer
    );
  };


}
