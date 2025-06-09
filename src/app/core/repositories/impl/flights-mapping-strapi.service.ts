import { Injectable } from "@angular/core"
import { Flight } from "../../models/flight.model"
import { IBaseMapping } from "../interfaces/base-mapping.interface"
import { Paginated } from "../../models/paginated.model"

export interface FlightRaw {
    data: Data
    meta: Meta
}

export interface Data{
    id: number
    attributes: FlightAttributes
}

export interface FlightData {
    data: FlightAttributes
}

export interface FlightAttributes {
    origin: string
    destination: string
    departureDate: string
    arrivalDate: string
    seatPrice: number
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

export interface Meta {}

@Injectable({
    providedIn: 'root'
  })
export class FlightsMappingStrapi implements IBaseMapping<Flight> {

  /**
   * Convierte un modelo `Flight` en el formato `FlightData` requerido por Strapi (para creación).
   *
   * @param data Objeto `Flight` a transformar
   * @returns Objeto listo para enviar a Strapi
   */
  setAdd(data: Flight):FlightData {
      return {
          data:{
              origin: data.origin,
              destination: data.destination,
              departureDate: data.departureDate,
              arrivalDate: data.arrivalDate,
              seatPrice: data.seatPrice
          }
      };
  }

 /**
   * Convierte una actualización parcial de `Flight` al formato requerido por Strapi.
   * Solo se mapean los campos presentes.
   *
   * @param data Datos parciales de `Flight`
   * @returns Objeto con estructura `FlightData` listo para enviar a Strapi
   */
  setUpdate(data: Partial<Flight>): FlightData {
    const mappedData: Partial<FlightAttributes> = {};

    Object.keys(data).forEach(key => {
      switch (key) {
        case 'origin':
          mappedData.origin = data[key] as string;
          break;
        case 'destination':
          mappedData.destination = data[key] as string;
          break;
        case 'departureDate':
          mappedData.departureDate = data[key] as string;
          break;
        case 'arrivalDate':
          mappedData.arrivalDate = data[key] as string;
          break;
        case 'seatPrice':
          mappedData.seatPrice = data[key] as number;
          break;
      }
    });

    return {
      data: mappedData as FlightAttributes
    };
  }

  /**
   * Adapta un array de vuelos crudos desde Strapi al modelo interno `Flight`, en formato paginado.
   *
   * @param page Página actual
   * @param pageSize Tamaño de página
   * @param pages Total de páginas
   * @param data Array de objetos `Data` (vuelos crudos desde Strapi)
   * @returns Estructura paginada con objetos `Flight`
   */
  getPaginated(page: number, pageSize: number, pages: number, data: Data[]): Paginated<Flight> {
    const validData = data.filter(d => d && d.id && d.attributes);

    return {
      page: page,
      pageSize: pageSize,
      pages: pages,
      data: validData.map((d: Data | FlightRaw) => this.getOne(d))
    };
  }

  /**
   * Convierte un vuelo en formato `FlightRaw` o `Data` (de Strapi) al modelo interno `Flight`.
   *
   * @param data Objeto crudo recibido desde Strapi
   * @returns Objeto `Flight` adaptado
   */
  getOne(data: Data | FlightRaw): Flight {
    const isFlightRaw = (data: Data | FlightRaw): data is FlightRaw => 'meta' in data;

    if (!data) {
      throw new Error('Flight data is undefined or null.');
    }

    const attributes = isFlightRaw(data) ? data.data?.attributes : data.attributes;
    const id = isFlightRaw(data) ? data.data?.id : data.id;

    return {
      id: id.toString(),
      origin: attributes.origin,
      destination: attributes.destination,
      departureDate: attributes.departureDate,
      arrivalDate: attributes.arrivalDate,
      seatPrice: attributes.seatPrice
    };
  }

  /**
   * Procesa la respuesta al añadir un vuelo y lo convierte en un objeto `Flight`.
   *
   * @param data Respuesta de Strapi al crear
   * @returns Objeto `Flight` adaptado
   */
  getAdded(data: FlightRaw): Flight {
    return this.getOne(data.data);
  }

  /**
   * Procesa la respuesta al actualizar un vuelo y lo convierte en un objeto `Flight`.
   *
   * @param data Respuesta de Strapi al actualizar
   * @returns Objeto `Flight` adaptado
   */
  getUpdated(data: FlightRaw): Flight {
    return this.getOne(data.data);
  }

  /**
   * Procesa la respuesta al eliminar un vuelo y lo convierte en un objeto `Flight`.
   *
   * @param data Respuesta de Strapi al eliminar
   * @returns Objeto `Flight` adaptado
   */
  getDeleted(data: FlightRaw): Flight {
    return this.getOne(data.data);
  }
}
