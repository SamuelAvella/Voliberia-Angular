import { Injectable } from "@angular/core";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Booking } from "../../models/booking.model";

export interface UserAppRaw {
    data: UserAppData
}

export interface UserAppData {
    id: number
    attributes: UserAppAttributes
}

export interface UserAppAttributes{
    name: string
    surname: string
    idDocument?: string
    birthDate?: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

export interface FlightRaw {
    data: FlightData
    meta: Meta
}

export interface FlightData {
    id: number
    attributes: FlighAttributes
}

export interface FlighAttributes{
    origin: string
    destination: string
    departureDate: string
    arrivalDate: string
    seatPrice: number
    createdAt: string
    updatedAt: string
    publishedAt: string
}


export interface BookingRaw {
    data: Data
    meta: Meta
}

export interface Data{
    id: number
    attributes: BookingAttributes
}
export interface BookingData {
    data: BookingAttributes
}

export interface BookingAttributes {
    bookingState: BookingState
    createdAt?: string
    updatedAt?: string
    userApp: UserAppRaw | number
    flight: FlightRaw | number
}

interface Meta{}

/**
 * Tipos de estado permitidos para una reserva.
 */
export type BookingState = 'pending' | 'confirm' | 'cancelled';

/**
 * Sanitiza el estado de la reserva, devolviendo uno válido o 'cancelled' por defecto.
 *
 * @param state Valor a validar
 * @returns Estado válido de tipo BookingState
 */
const sanitizeBookingState = (state: any): BookingState => {
  if (typeof state !== 'string') return 'cancelled';
  return (['pending', 'confirm', 'cancelled'].includes(state) ? state : 'cancelled') as BookingState;
};


/**
 * Servicio de mapeo para Booking en Strapi.
 * Convierte entre los datos internos de la app y el formato esperado/enviado por el backend.
 */
@Injectable({
  providedIn: 'root'
})
export class BookingMappingStrapi implements IBaseMapping<Booking> {

  /**
   * Mapea un objeto Booking de la app al formato necesario para hacer POST en Strapi.
   *
   * @param data Objeto Booking
   * @returns Objeto con estructura esperada por Strapi
   */
  setAdd(data: Booking) : BookingData{
      return {
          data:{
              bookingState: sanitizeBookingState(data.bookingState),
              userApp:data.userAppId?Number(data.userAppId): 0,
              flight:data.flightId?Number(data.flightId): 0,
          }
      }
  }

  /**
   * Mapea campos parciales para una actualización (PUT o PATCH) en Strapi.
   *
   * @param data Objeto parcial de Booking
   * @returns Estructura parcial para Strapi
   */
  setUpdate(data: Partial<Booking>) {
      const mappedData: Partial<BookingAttributes> = {};

      Object.keys(data).forEach(key => {
          switch(key){
              case 'bookingState' : mappedData.bookingState = sanitizeBookingState(data[key]);
              break;
              case 'userAppId' : mappedData.userApp = data[key] ? Number(data[key]) : undefined;
              break;
              case 'flightId' : mappedData.flight = data[key] ? Number(data[key]) : undefined;
              break;
          }
      })

      return {
          data: mappedData as BookingAttributes
      }
  }

  /**
   * Mapea una respuesta paginada desde Strapi a un objeto paginado interno.
   *
   * @param page Página actual
   * @param pageSize Tamaño por página
   * @param pages Total de páginas
   * @param data Lista de reservas recibidas de Strapi
   * @returns Objeto paginado de Bookings
   */
  getPaginated(page: number, pageSize: number, pages: number, data: Data[]): Paginated<Booking> {
      const validData = data.filter(d => d && d.id && d.attributes);


      return {
          page: page,
          pageSize: pageSize,
          pages: pages,
          data: validData.map<Booking>((d: Data | BookingRaw) => this.getOne(d)),
      };
  }

  /**
   * Convierte una reserva recibida de Strapi a un objeto Booking interno.
   *
   * @param data Datos brutos recibidos (puede ser BookingRaw o Data)
   * @returns Objeto Booking
   */
  getOne(data: Data | BookingRaw): Booking {
      const isBookingRaw = (data: Data | BookingRaw): data is BookingRaw => 'meta' in data;


      // Validate structure base
      if (!data) {
          throw new Error('Booking data is undefined or null.');
      }

      const attributes = isBookingRaw(data) ? data.data?.attributes : data.attributes;
      const id = isBookingRaw(data) ? data.data?.id : data.id;

      // Validate id and attributes exits
      if (!id) {
          console.log("El id de booking no lo pilla")
      }
      if (!attributes) {
          console.log("Los atributos de booking no los pilla")
      }

      const state = sanitizeBookingState(attributes.bookingState)


      return {
          id: id.toString(),
          bookingState: state || 'cancelled',
          userAppId: typeof attributes.userApp === 'object' && attributes.userApp?.data
              ? attributes.userApp.data.id.toString()
              : attributes.userApp
              ? attributes.userApp.toString()
              : '',
          flightId: typeof attributes.flight === 'object' && attributes.flight?.data
              ? attributes.flight.data.id.toString()
              : attributes.flight
              ? attributes.flight.toString()
              : '',
      };
  }

  /**
   * Procesa la respuesta al añadir una reserva y lo convierte en un objeto `Booking`.
   *
   * @param data Respuesta de Strapi al crear
   * @returns Objeto `Booking` adaptado
   */
  getAdded(data: BookingRaw): Booking {
      return this.getOne(data.data);
  }

  /**
   * Procesa la respuesta al actualizar una reserva y lo convierte en un objeto `Booking`.
   *
   * @param data Respuesta de Strapi al actualizar
   * @returns Objeto `Booking` adaptado
   */
  getUpdated(data: BookingRaw): Booking {
      return this.getOne(data.data);
  }

  /**
   * Procesa la respuesta al eliminar una reserva y lo convierte en un objeto `Booking`.
   *
   * @param data Respuesta de Strapi al eliminar
   * @returns Objeto `Booking` adaptado
   */
  getDeleted(data: BookingRaw): Booking {
      return this.getOne(data.data);
  }




}
