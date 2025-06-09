/**
 * @file base-repository.interface.ts
 * @description Interfaz base para los repositorios de datos.
 */

import { Observable } from "rxjs";
import { Model } from "../../models/base.model";
import { Paginated } from "../../models/paginated.model";

/**
 * Parámetros de búsqueda genéricos para filtros.
 */
export interface SearchParams {
  [key: string]: string;
}

/**
 * Interfaz base para cualquier repositorio de tipo `T`.
 * @template T Tipo de modelo que maneja el repositorio.
 */
export interface IBaseRepository<T extends Model> {
  getAll(page: number, pageSize: number, filters: SearchParams): Observable<T[] | Paginated<T>>;
  getById(id: string): Observable<T | null>;
  add(entity: T): Observable<T>;
  update(id: string, entity: T): Observable<T>;
  delete(id: string): Observable<T>;
}
