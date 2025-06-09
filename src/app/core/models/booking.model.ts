import { Model } from "./base.model";

export type BookingState = 'pending' | 'confirm' | 'cancelled'

export interface Booking extends Model{
    bookingState: BookingState,
    userAppId?: string,
    flightId: string,
}
