/**
 * @file base.model.ts
 * @description Modelo base genérico con campos comunes para todos los modelos.
 */

/**
 * Modelo base con identificador y fechas de creación/actualización.
 */
export interface Model {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}
