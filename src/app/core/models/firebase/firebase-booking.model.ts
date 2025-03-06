import { DocumentReference } from "firebase/firestore";

export interface FirebaseBooking{
    bookingState:boolean, 
    flight: DocumentReference, 
    user_app?: DocumentReference,  
}