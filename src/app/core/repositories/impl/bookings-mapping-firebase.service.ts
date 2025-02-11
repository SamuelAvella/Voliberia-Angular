import { Inject, Injectable } from "@angular/core";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Booking } from "../../models/booking.model";
import { Paginated } from "../../models/paginated.model";
import { doc, Firestore, getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG_TOKEN } from "../repository.token";
import { initializeApp } from "firebase/app";
import { FirebaseBooking } from "../../models/firebase/firebase-booking.model";

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
            bookingState: data.bookingState, 
            flightId: data.flight?.id, 
            userAppId: data.user_app?.id || '', 
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
        return {
            bookingState: data.bookingState,
            flight: doc(this.db, 'flights', data.flightId), // Debe existir siempre
            user_app: data.userAppId ? doc(this.db, 'user-apps', data.userAppId) : undefined // Opcional
        };
    }
    setUpdate(data: any) {
        throw new Error("Method not implemented.");
    }
    
}