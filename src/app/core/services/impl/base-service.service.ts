/**
 * Servicio genérico que conecta servicios con sus repositorios.
 * Implementa operaciones CRUD y paginación.
 */
import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IBaseService } from '../interfaces/base-service.interface';
import { Model } from '../../models/base.model';
import { Paginated } from '../../models/paginated.model';
import { REPOSITORY_TOKEN } from '../../repositories/repository.token';
import { IBaseRepository, SearchParams } from '../../repositories/interfaces/base-repository.interface';

@Injectable({
  providedIn: 'root'
})
export class BaseService<T extends Model> implements IBaseService<T> {
  constructor(
    @Inject(REPOSITORY_TOKEN) protected repository: IBaseRepository<T>
  ) {}

  
  getAll(): Observable<T[]>;
  getAll(page: number, pageSize: number): Observable<Paginated<T>>;
  getAll(page: number, pageSize: number, filters: SearchParams): Observable<Paginated<T>>;
  /**
   * Obtiene todos los elementos, opcionalmente paginados y filtrados.
   */
  getAll(page?: number, pageSize?: number, filters?: SearchParams): Observable<T[] | Paginated<T>> {
    if (page === undefined || pageSize === undefined)
        return this.repository.getAll(1, 25, {});
    else
    return this.repository.getAll(page, pageSize, filters??{});
  }


  /** Obtiene un elemento por ID */
  getById(id: string): Observable<T | null> {
    return this.repository.getById(id);
  }

  /** Añade un nuevo elemento */
  add(entity: T): Observable<T> {
    return this.repository.add(entity);
  }

  /** Actualiza un elemento existente */
  update(id: string, entity: Partial <T>) : Observable<T> {
    return this.repository.update(id, entity);
  }
  
  /** Elimina un elemento */
  delete(id: string): Observable<T> {
    return this.repository.delete(id);
  }
}
