import { Model } from "./base.model";

export interface Seat extends Model {
  number:string,
  reserved:boolean,
  flightId:string,
  bookingId?:string
}
  