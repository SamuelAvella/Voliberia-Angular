import { Model } from "./base.model";

/**
 * Estado posible de una reserva.
 */
export type BookingState = 'pending' | 'confirm' | 'cancelled';

/**
 * Modelo de reserva (Booking).
 */
export interface Booking extends Model {
  /** Estado actual de la reserva */
  bookingState: BookingState;
  /** ID del usuario que ha realizado la reserva */
  userAppId?: string;
  /** ID del vuelo reservado */
  flightId: string;
}
