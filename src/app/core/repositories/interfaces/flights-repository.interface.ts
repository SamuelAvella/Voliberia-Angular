/**
 * @file flights-repository.interface.ts
 * @description Repositorio especializado para el modelo Flight.
 */

import { Flight } from "../../models/flight.model";
import { IBaseRepository } from "./base-repository.interface";

/**
 * Repositorio para vuelos. Actualmente no amplía funciones específicas.
 */
export interface IFlightsRepository extends IBaseRepository<Flight> {}
