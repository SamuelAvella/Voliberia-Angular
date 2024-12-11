import { Injectable } from "@angular/core";
import { StrapiRepositoryService } from "./strapi-repository.service";
import { Booking } from "../../models/booking.model";
import { IBookingsRepository } from "../interfaces/bookings-repository.interface";

@Injectable({
    providedIn: 'root'
  })

export class BookingsStrapiRepositoryService extends StrapiRepositoryService<Booking> implements IBookingsRepository{

}