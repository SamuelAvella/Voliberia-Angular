import { DocumentReference } from "firebase/firestore";
import { BookingState } from '../booking.model'

export interface FirebaseBooking{
    bookingState:BookingState,
    flight: DocumentReference,
    user_app?: DocumentReference,
}
