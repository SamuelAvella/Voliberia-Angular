/**
 * Servicio que gestiona las operaciones sobre vuelos.
 */

import { Inject, Injectable } from "@angular/core";
import { BaseService } from "./base-service.service";
import { Flight } from "../../models/flight.model";
import { IFlightsService } from "../interfaces/flights.service.interface";
import { FLIGHTS_REPOSITORY_TOKEN } from "../../repositories/repository.token";
import { IFlightsRepository } from "../../repositories/interfaces/flights-repository.interface";

@Injectable({
    providedIn: 'root'
})

export class FlightsService extends BaseService<Flight> implements IFlightsService{
    constructor(
        @Inject(FLIGHTS_REPOSITORY_TOKEN) repository: IFlightsRepository
    ) {
        super(repository);
    }
    
}