/**
 * @file base-mapping.interface.ts
 * @description Interfaz para el mapeo genérico entre estructuras de datos (API/Firestore ↔️ modelos internos).
 */

import { Paginated } from "../../models/paginated.model";

/**
 * Interfaz base de mapeo de modelos.
 * @template T Tipo de dato que se mapea.
 */
export interface IBaseMapping<T> {
  getPaginated(page: number, pageSize: number, pages: number, data: any): Paginated<T>;
  getOne(data: any): T;
  getAdded(data: any): T;
  getUpdated(data: any): T;
  getDeleted(data: any): T;
  setAdd(data: T): any;
  setUpdate(data: any): any;
}
