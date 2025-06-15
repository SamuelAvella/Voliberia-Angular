/**
 * @file paginated.model.ts
 * @description Modelo genérico para paginación de resultados.
 */

/**
 * Representa una respuesta paginada de elementos.
 * @template T Tipo de dato contenido en la paginación.
 */
export interface Paginated<T> {
  /** Array de elementos */
  data: T[];
  /** Página actual */
  page: number;
  /** Total de páginas */
  pages: number;
  /** Tamaño de página */
  pageSize: number;
}
