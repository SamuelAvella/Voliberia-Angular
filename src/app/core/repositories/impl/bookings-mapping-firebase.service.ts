import { Inject, Injectable } from "@angular/core";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Booking, BookingState } from "../../models/booking.model";
import { Paginated } from "../../models/paginated.model";
import { doc, Firestore, getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG_TOKEN } from "../repository.token";
import { initializeApp } from "firebase/app";
import { FirebaseBooking } from "../../models/firebase/firebase-booking.model";

const sanitizeBookingState = (state: any): BookingState => {
  return ['pending', 'confirm', 'cancelled'].includes(state) ? state : 'cancelled';
};

@Injectable({
    providedIn: 'root'
})
export class BookingsMappingFirebaseService implements IBaseMapping<Booking>{

    private db: Firestore;

    constructor(@Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig: any){
        this.db = getFirestore(initializeApp(firebaseConfig))
    }

    getOne(data: {id: string} & FirebaseBooking): Booking {
        return {
            id: data.id,
            bookingState: sanitizeBookingState(data.bookingState),
            flightId: data.flight?.id || data.flight?.path?.split('/').pop() || '',
            userAppId: data.user_app?.id || data.user_app?.path?.split('/').pop() || '',
        }
    }

    getPaginated(page: number, pageSize: number, total: number, data: ({id:string} & FirebaseBooking)[]): Paginated<Booking> {
        return {
            page,
            pageSize,
            pages: Math.ceil(total / pageSize),
            data: data.map(item => this.getOne(item))
          };
    }

    getAdded(data: {id:string} & FirebaseBooking): Booking {
        return this.getOne(data);
    }

    getUpdated(data: {id:string} & FirebaseBooking): Booking {
        return this.getOne(data);
    }

    getDeleted(data: {id:string} & FirebaseBooking): Booking {
        return this.getOne(data);
    }

    setAdd(data: Booking): FirebaseBooking {
      console.log('[setAdd - Firebase] Recibo:', data);

      const result: any = {
        bookingState: sanitizeBookingState(data.bookingState)
      };

      if (data.flightId) {
        result.flight = doc(this.db, 'flights', data.flightId);
        console.log('[setAdd - Firebase] Referencia flight creada:', result.flight.path);
      } else {
        console.warn('[setAdd - Firebase] ❌ flightId no proporcionado');
      }

      if (data.userAppId) {
        result.user_app = doc(this.db, 'user-apps', data.userAppId);
        console.log('[setAdd - Firebase] Referencia user_app creada:', result.user_app.path);
      } else {
        console.warn('[setAdd - Firebase] ❌ userAppId no proporcionado');
      }

      return result;
    }

    setUpdate(data: Partial<Booking>): FirebaseBooking {
        const result: any = {};

        if (data.bookingState !== undefined) {
            result.bookingState = sanitizeBookingState(data.bookingState);
        }

        if (data.flightId) {
            result.flight = doc(this.db, 'flights', data.flightId);
        }

        if (data.userAppId) {
            result.user_app = doc(this.db, 'user_app', data.userAppId);
        }

        return result;
    }
}
