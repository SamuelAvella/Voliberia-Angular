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

        let dataMapping:FirebaseBooking = {
            bookingState: data.bookingState,
            flight: doc(this.db, 'flights', data.flightId), // Must exist
        };
        if(dataMapping.user_app){
            dataMapping.user_app = doc(this.db, 'group', data.userAppId|| '')
        }

        return dataMapping;
    }
    
    setUpdate(data: Partial<Booking>): FirebaseBooking {
        const result: any = {};

        if (data.bookingState) result.bookingState = data.bookingState;
        if (data.flightId) result.flight = data.flightId;
        if (data.userAppId) result.user_app = data.userAppId;

        return result;
    }
    
}