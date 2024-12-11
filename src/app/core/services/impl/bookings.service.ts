import { Inject, Injectable } from "@angular/core";
import { BaseService } from "./base-service.service";
import { BOOKINGS_REPOSITORY_TOKEN } from "../../repositories/repository.token";
import { Booking } from "../../models/booking.model";
import { IBookingsService } from "../interfaces/bookings-service.interface";

@Injectable({
    providedIn: 'root'
})

export class BookingsService extends BaseService<Booking> implements IBookingsService{
    
    constructor(
        @Inject(BOOKINGS_REPOSITORY_TOKEN) repository: IBookingsService
    ) {
        super(repository);
    }

    
}