import { Inject, Injectable } from "@angular/core";
import { BaseService } from "./base-service.service";
import { SEATS_REPOSITORY_TOKEN } from "../../repositories/repository.token";
import { Seat } from "../../models/seat.model";
import { ISeatsRepository } from "../../repositories/interfaces/seats-repository.interface";
import { ISeatsService } from "../interfaces/seats-service.interface";

@Injectable({
    providedIn: 'root'
})

export class SeatsService extends BaseService<Seat> implements ISeatsService{
    constructor(
        @Inject(SEATS_REPOSITORY_TOKEN) repository: ISeatsRepository
    ) {
        super(repository);
    }
}