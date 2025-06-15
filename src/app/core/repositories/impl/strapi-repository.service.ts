// src/app/repositories/impl/base-repository-http.service.ts
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Model } from '../../models/base.model';
import { Paginated } from '../../models/paginated.model';
import { BaseRepositoryHttpService } from './base-repository-http.service';
import { IStrapiAuthentication } from '../../services/interfaces/strapi-authentication.interface';
import { API_URL_TOKEN, REPOSITORY_MAPPING_TOKEN, RESOURCE_NAME_TOKEN, STRAPI_AUTH_TOKEN } from '../repository.token';
import { SearchParams } from '../interfaces/base-repository.interface';
import { IBaseMapping } from '../interfaces/base-mapping.interface';

export interface PaginatedRaw<T> {
  data: Data<T>[]
  meta: Meta
}

export interface Data<T> {
  id: number
  attributes: T
}


export interface Meta {
  pagination: Pagination
}

export interface Pagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

/**
 * Servicio genérico para acceder a cualquier entidad en una API Strapi.
 * Implementa operaciones CRUD con soporte para paginación.
 *
 * @typeParam T - Tipo de modelo
 */
@Injectable({
  providedIn: 'root'
})
export class StrapiRepositoryService<T extends Model> extends BaseRepositoryHttpService<T> {

  /**
   * Constructor que inicializa el repositorio con dependencias inyectadas.
   *
   * @param http Cliente HTTP de Angular
   * @param auth Servicio de autenticación para obtener el token JWT
   * @param apiUrl URL base de la API
   * @param resource Nombre del recurso (por ejemplo, 'users', 'flights')
   * @param mapping Servicio de mapeo para transformar entre modelo interno y estructura de Strapi
   */
  constructor(
    http: HttpClient,
    @Inject(STRAPI_AUTH_TOKEN) override auth: IStrapiAuthentication,
    @Inject(API_URL_TOKEN) apiUrl: string, // Base URL of the API for the model
    @Inject(RESOURCE_NAME_TOKEN) resource:string, // Name of the repository resource
    @Inject(REPOSITORY_MAPPING_TOKEN) mapping:IBaseMapping<T>
  ) {
    super(http, auth, apiUrl, resource, mapping);
  }

  /**
   * Genera las cabeceras HTTP, incluyendo el token de autenticación si existe.
   *
   * @returns Objeto con cabeceras configuradas
   */
  protected getHeaders() {
    const token = this.auth.getToken();
    return {
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
    };
  }

  /**
   * Obtiene todos los elementos del recurso.
   * Si `page = -1`, se omite la paginación y se devuelven todos los resultados.
   * Admite filtros opcionales.
   *
   * @param page Página actual
   * @param pageSize Tamaño de página
   * @param filters Objeto de filtros dinámicos (clave-valor)
   * @returns Observable con resultados paginados o lista completa
   */
  override getAll(page:number, pageSize:number, filters:SearchParams = {}): Observable<T[] | Paginated<T>> {

    let search: string = Object.entries(filters)
      .map(([k, v]) =>
        `filters[${k}][$contains]=${v}`)
      .reduce((p, v) => `${p}${v}`, "");
    if(page!=-1){
      return this.http.get<PaginatedRaw<T>>(
        `${this.apiUrl}/${this.resource}?pagination[page]=${page}&pagination[pageSize]=${pageSize}&${search}&populate=user,flight,booking,picture,user_app`,
        this.getHeaders()).pipe(map(res=>{
          return this.mapping.getPaginated(page, pageSize, res.meta.pagination.total, res.data);
        }));
    }
    else{
      return this.http.get<PaginatedRaw<T>>(
        `${this.apiUrl}/${this.resource}?&${search}`,
        this.getHeaders()).pipe(map((res:PaginatedRaw<T>)=>{
          return res.data.map((elem:Data<T>)=>{
            return this.mapping.getOne(elem);
          });
        }));
    }
  }

  /**
   * Crea un nuevo documento en la API.
   *
   * @param entity Objeto del modelo a crear
   * @returns Observable con el objeto creado
   */
  override add(entity: T): Observable<T> {
    return this.http.post<T>(
      `${this.apiUrl}/${this.resource}`, this.mapping.setAdd(entity),
      this.getHeaders()).pipe(map(res=>{
        return this.mapping.getAdded(res);
      }));
  }

  /**
   * Actualiza un documento existente.
   *
   * @param id ID del recurso a actualizar
   * @param entity Objeto con los datos a actualizar
   * @returns Observable con el objeto actualizado
   */
  override update(id: string, entity: T): Observable<T> {
    return this.http.put<T>(
      `${this.apiUrl}/${this.resource}/${id}`, this.mapping.setUpdate(entity),
      this.getHeaders()).pipe(map(res=>{
        return this.mapping.getUpdated(res);
      }));
  }

  /**
   * Elimina un documento por su ID.
   *
   * @param id ID del documento a eliminar
   * @returns Observable con el objeto eliminado
   */
  override delete(id: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${this.resource}/${id}`,
      this.getHeaders()).pipe(map(res=>this.mapping.getDeleted(res)));
  }

}
