import { Inject, Injectable } from '@angular/core';
import { IBaseRepository, SearchParams } from '../interfaces/base-repository.interface';
import { HttpClient } from '@angular/common/http';
import { API_URL_TOKEN, AUTH_MAPPING_TOKEN, AUTH_TOKEN, REPOSITORY_MAPPING_TOKEN, RESOURCE_NAME_TOKEN } from '../repository.token';
import { Model } from '../../models/base.model';
import { map, Observable } from 'rxjs';
import { Paginated } from '../../models/paginated.model';
import { IBaseMapping } from '../interfaces/base-mapping.interface';
import { IAuthentication } from '../../services/interfaces/authentication.interface';



/**
 * Servicio genérico para gestionar peticiones HTTP a un backend RESTful.
 * Implementa las operaciones básicas de un repositorio (CRUD) para cualquier modelo.
 *
 * @template T - Tipo de modelo que extiende de Model
 */
@Injectable({
    providedIn:'root'
})
export class BaseRepositoryHttpService<T extends Model> implements IBaseRepository<T>{

   /**
   * Constructor del repositorio HTTP base.
   *
   * @param http Cliente HTTP de Angular para hacer peticiones
   * @param auth Servicio de autenticación para incluir tokens u otra lógica de seguridad
   * @param apiUrl URL base del backend
   * @param resource Recurso específico (endpoint) que se gestionará
   * @param mapping Servicio de mapeo para convertir respuestas del backend en modelos locales
   */
  constructor(
      protected http: HttpClient,
      @Inject(AUTH_TOKEN) protected auth: IAuthentication,
      @Inject(API_URL_TOKEN) protected apiUrl: string,
      @Inject(RESOURCE_NAME_TOKEN) protected resource:string,
      @Inject(REPOSITORY_MAPPING_TOKEN) protected mapping:IBaseMapping<T>
  ) {
      this.apiUrl = apiUrl;
  }

  /**
   * Obtiene todos los elementos del recurso con paginación y filtrado opcional.
   *
   * @param page Página actual
   * @param pageSize Tamaño de página
   * @param filters Filtros para aplicar en la consulta
   * @returns Observable con los resultados paginados o array de elementos
   */
  getAll(page: number, pageSize: number, filters: SearchParams): Observable<T[] | Paginated<T>> {
      return this.http.get<T[]>(`${this.apiUrl}/${this.resource}`).pipe(
          map((res: any) => {
              if (!res || !res.data) {
                  throw new Error(`Invalid API response for resource ${this.resource}`);
              }
              return this.mapping.getPaginated(page, pageSize, 0, res.data);
          }));
  }

   /**
   * Obtiene un único elemento por ID.
   *
   * @param id ID del elemento
   * @returns Observable con el modelo correspondiente o null si no se encuentra
   */
  getById(id: string): Observable<T | null> {
      return this.http.get<T>(`${this.apiUrl}/${this.resource}/${id}`).pipe(map(res=>this.mapping.getOne(res)));
  }

  /**
   * Añade un nuevo elemento al recurso.
   *
   * @param entity Elemento a añadir
   * @returns Observable con el elemento añadido
   */
  add(entity: T): Observable<T> {
      return this.http.post<T>(`${this.apiUrl}/${this.resource}`, entity).pipe(map(res=>this.mapping.getAdded(res)));
  }

  /**
   * Actualiza un elemento existente por ID.
   *
   * @param id ID del elemento a actualizar
   * @param entity Datos actualizados
   * @returns Observable con el elemento actualizado
   */
  update(id: string, entity: T): Observable<T> {
      return this.http.put<T>(`${this.apiUrl}/${this.resource}/${id}`, entity).pipe(map(res=>this.mapping.getUpdated(res)));
  }

  /**
   * Elimina un elemento del recurso por ID.
   *
   * @param id ID del elemento a eliminar
   * @returns Observable con el resultado de la eliminación
   */
  delete(id: string): Observable<T> {
      return this.http.delete<T>(`${this.apiUrl}/${this.resource}/${id}`).pipe(map(res=>this.mapping.getDeleted(res)));
  }
}


