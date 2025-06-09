/**
 * @file bookings-repository.interface.ts
 * @description Repositorio especializado para el modelo Booking.
 */

import { Observable } from "rxjs";
import { Booking } from "../../models/booking.model";
import { IBaseRepository } from "./base-repository.interface";

/**
 * Repositorio para reservas con función adicional para borrar por vuelo.
 */
export interface IBookingsRepository extends IBaseRepository<Booking> {
  deleteBookingsByFlightId(flightId: string): Observable<void>;
}
