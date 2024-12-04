import { Model } from "./base.model";

export interface Flight extends Model{
    origin:string,
    destination:string,
    departureDate:string,
    arrivalDate:string,
    seatPrice:number,
    seats?:[]
}