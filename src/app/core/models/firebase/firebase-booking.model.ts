import { DocumentReference } from "firebase/firestore";
import { BookingState } from '../booking.model';

/**
 * Modelo de reserva en Firebase.
 */
export interface FirebaseBooking {
  bookingState: BookingState;
  /** Referencia al documento del vuelo */
  flight: DocumentReference;
  /** Referencia al documento del usuario (UserApp) */
  user_app?: DocumentReference;
}
