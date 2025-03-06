import { Observable } from "rxjs";
import { Booking } from "../../models/booking.model";
import { IBaseService } from "../interfaces/base-service.interface";

export interface IBookingsService extends IBaseService<Booking>{
    
    deleteBookingsByFlightId(flightId: string): Observable<void>
}