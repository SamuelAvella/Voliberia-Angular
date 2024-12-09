import { Model } from "./base.model";

export interface Booking extends Model{
    bookingState:boolean, 
    userAppId: string,  
    flightId: string, 
}