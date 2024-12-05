import { Booking } from "../../models/booking.model";
import { IBaseRepository } from "./base-repository.interface";

export interface IBookingsRepository extends IBaseRepository<Booking>{

}