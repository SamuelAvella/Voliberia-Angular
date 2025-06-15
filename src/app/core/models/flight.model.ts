import { Model } from "./base.model";

/**
 * Modelo de vuelo (Flight).
 */
export interface Flight extends Model {
  /** Ciudad de origen del vuelo */
  origin: string;
  /** Ciudad de destino del vuelo */
  destination: string;
  /** Fecha y hora de salida */
  departureDate: string;
  /** Fecha y hora de llegada */
  arrivalDate: string;
  /** Precio del asiento */
  seatPrice: number;
}
