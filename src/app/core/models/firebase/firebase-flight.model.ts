/**
 * Modelo de vuelo en Firebase.
 */
export interface FirebaseFlight {
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  seatPrice: number;
}
