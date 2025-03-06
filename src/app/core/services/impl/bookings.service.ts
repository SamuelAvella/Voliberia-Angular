import { Inject, Injectable } from "@angular/core";
import { BaseService } from "./base-service.service";
import { BOOKINGS_REPOSITORY_TOKEN } from "../../repositories/repository.token";
import { Booking } from "../../models/booking.model";
import { IBookingsService } from "../interfaces/bookings-service.interface";
import { IBookingsRepository } from "../../repositories/interfaces/bookings-repository.interface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class BookingsService extends BaseService<Booking> implements IBookingsService {
  constructor(
    @Inject(BOOKINGS_REPOSITORY_TOKEN) public bookingsRepository: IBookingsRepository
  ) {
    super(bookingsRepository);
  }

  deleteBookingsByFlightId(flightId: string): Observable<void> {
    return this.bookingsRepository.deleteBookingsByFlightId(flightId);
  }
}
