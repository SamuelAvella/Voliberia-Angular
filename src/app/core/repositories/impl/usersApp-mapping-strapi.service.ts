import { Injectable } from "@angular/core";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { StrapiMedia } from "../../services/impl/strapi-media.service";
import { UserApp } from "../../models/userApp.model";


export interface MediaRaw{
    data: StrapiMedia
}

export interface UserRaw{
    data: UserData
}

export interface UserData{
    id: number
    attributes: UserAttributes
}

export interface UserAttributes {
    username: string
    email: string
    provider: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
}

export interface BookingRaw{
    data: BookingData
    meta: Meta
}

export interface BookingData {
    id: number
    attributes: BookingAttributes
}

export interface BookingAttributes {
    bookingState: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
}


export interface UserAppRaw {
    data: Data
    meta: Meta
}

export interface Data {
    id: number
    attributes: UserAppAttributes
}

export interface UserAppData {
    data: UserAppAttributes
}

export interface UserAppAttributes {
    name: string
    surname: string
    idDocument?: string
    birthdate?: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
    role: 'admin' | 'user'
    bookings:BookingRaw | number | null
    user:UserRaw | number | null,
    picture:MediaRaw | number | null
}

export interface Meta {}

/**
 * Servicio de mapeo entre el modelo interno `UserApp` y los datos obtenidos desde Strapi.
 */
@Injectable({
    providedIn: 'root'
  })
export class UserAppMappingStrapi implements IBaseMapping<UserApp> {

  /**
   * Mapea un modelo `UserApp` a un formato compatible con la API de Strapi (creación).
   * @param data Datos del modelo `UserApp`
   * @returns Objeto con la estructura requerida por Strapi
   */
  setAdd(data: UserApp):UserAppData {
      return {
          data:{
              name: data.name,
              surname: data.surname,
              role: data.role || 'user',
              bookings: data.bookingsId ? Number(data.bookingsId) : null,
              user: data.userId ? Number(data.userId) : null,
              picture: data.picture ? Number(data.picture) : null
          }
      };
  }

  /**
   * Mapea campos modificados de `UserApp` al formato Strapi para actualización.
   * @param data Datos parciales del modelo `UserApp`
   * @returns Objeto parcial mapeado para Strapi
   */
  setUpdate(data: Partial<UserApp>): UserAppData {
      const mappedData: Partial<UserAppAttributes> = {};

      Object.keys(data).forEach(key => {
          switch(key){
              case 'name': mappedData.name = data[key];
              break;
              case 'surname': mappedData.surname = data[key];
              break;
              case 'role': mappedData.role = data[key];
              break;
              case 'bookingsId': mappedData.bookings = data[key] ? Number(data[key]) : null;
              break;
              case 'userId': mappedData.user = data[key] ? Number(data[key]) : null;
              break;
              case 'picture': mappedData.picture = data[key] ? Number(data[key]) : null;
              break;
          }
      });

      return {
          data: mappedData as UserAppAttributes
      };
  }

  /**
   * Convierte una lista de datos de Strapi a una estructura paginada de `UserApp`.
   * @param page Página actual
   * @param pageSize Tamaño por página
   * @param pages Total de páginas
   * @param data Lista de datos en formato `Data`
   * @returns Objeto paginado con modelos `UserApp`
   */
  getPaginated(page:number, pageSize: number, pages:number, data:Data[]): Paginated<UserApp> {
      return {page:page, pageSize:pageSize, pages:pages, data:data.map<UserApp>((d:Data|UserAppRaw)=>{
          return this.getOne(d);
      })};
  }

  /**
   * Convierte un único dato de Strapi en un modelo `UserApp`.
   * @param data Objeto `Data` o `UserAppRaw`
   * @returns Objeto `UserApp` completo
   */
  getOne(data: Data | UserAppRaw): UserApp {
      const isUserAppRaw = (data: Data | UserAppRaw): data is UserAppRaw => 'meta' in data;

      const attributes = isUserAppRaw(data) ? data.data.attributes : data.attributes;
      const id = isUserAppRaw(data) ? data.data.id : data.id;

      return {
          id: id.toString(),
          name: attributes.name,
          surname: attributes.surname,
          role: attributes.role || 'user',
          bookingsId: typeof attributes.bookings === 'object' ? attributes.bookings?.data?.id.toString() : undefined,
          userId: typeof attributes.user === 'object' ? attributes.user?.data?.id.toString() : undefined,
          picture: typeof attributes.picture === 'object' ? {
              url: attributes.picture?.data?.attributes?.url,
              large: attributes.picture?.data?.attributes?.formats?.large?.url || attributes.picture?.data?.attributes?.url,
              medium: attributes.picture?.data?.attributes?.formats?.medium?.url || attributes.picture?.data?.attributes?.url,
              small: attributes.picture?.data?.attributes?.formats?.small?.url || attributes.picture?.data?.attributes?.url,
              thumbnail: attributes.picture?.data?.attributes?.formats?.thumbnail?.url || attributes.picture?.data?.attributes?.url,
          } : undefined
      };
  }


  /**
   * Procesa la respuesta al añadir un usuario y lo convierte en un objeto `UserApp`.
   *
   * @param data Respuesta de Strapi al crear
   * @returns Objeto `UserApp` adaptado
   */
  getAdded(data: UserAppRaw):UserApp {
      return this.getOne(data.data);
  }

  /**
   * Procesa la respuesta al actualizar un usuario y lo convierte en un objeto `UserApp`.
   *
   * @param data Respuesta de Strapi al actualizar
   * @returns Objeto `UserApp` adaptado
   */
  getUpdated(data: UserAppRaw):UserApp {
      return this.getOne(data.data);
  }

  /**
   * Procesa la respuesta al eliminar un usuario y lo convierte en un objeto `UserApp`.
   *
   * @param data Respuesta de Strapi al eliminar
   * @returns Objeto `UserApp` adaptado
   */
  getDeleted(data: UserAppRaw):UserApp {
      return this.getOne(data.data);
  }
}
