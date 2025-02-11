import { Inject, Injectable } from "@angular/core";
import { Flight } from "../../models/flight.model";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Firestore, getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG_TOKEN } from "../repository.token";
import { initializeApp } from "firebase/app";
import { FirebaseFlight } from "../../models/firebase/firebase-flight.model";

@Injectable({
    providedIn: 'root'
})
export class FlightsMappingFirebaseService implements IBaseMapping<Flight>{

    private db: Firestore;

    constructor(@Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig: any){
        this.db = getFirestore(initializeApp(firebaseConfig))
    }
    
    getOne(data: {id: string} & FirebaseFlight): Flight {
        return{
            id: data.id,
            origin: data.origin,
            destination: data.destination,
            departureDate: data.departureDate,
            arrivalDate: data.arrivalDate,
            seatPrice: data.seatPrice,
        };
    }

    getPaginated(page: number, pageSize: number, total: number, data: ({id: string} &FirebaseFlight)[]): Paginated<Flight> {
        return {
            page,
            pageSize,
            pages: Math.ceil(total / pageSize),
            data: data.map(item => this.getOne(item))
        };
    }

    getAdded(data: {id: string} & FirebaseFlight): Flight {
        return this.getOne(data)
    }

    getUpdated(data: {id: string} & FirebaseFlight): Flight {
        return this.getOne(data)
    }

    getDeleted(data: {id: string} & FirebaseFlight): Flight {
        return this.getOne(data)
    }

    setAdd(data: Flight): FirebaseFlight {
        return {
            origin: data.origin,
            destination: data.destination,
            departureDate: data.departureDate,
            arrivalDate: data.arrivalDate,
            seatPrice: data.seatPrice,  
        };
    }

    setUpdate(data: Partial<Flight>): FirebaseFlight {
        const result: any = {};

        if (data.origin) result.origin = data.origin;
        if (data.destination) result.destination = data.destination;
        if (data.departureDate) result.departureDate = data.departureDate;
        if (data.arrivalDate) result.arrivalDate = data.arrivalDate;
        if (data.seatPrice) result.seatPrice = data.seatPrice;
        
        return result;
    }

}