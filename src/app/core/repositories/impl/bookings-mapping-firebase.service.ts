import { Injectable } from "@angular/core";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Booking } from "../../models/booking.model";
import { Paginated } from "../../models/paginated.model";

@Injectable({
    providedIn: 'root'
})
export class BookingsMappingFirebaseService implements IBaseMapping<Booking>{
    getPaginated(page: number, pageSize: number, pages: number, data: any): Paginated<Booking> {
        throw new Error("Method not implemented.");
    }
    getOne(data: any): Booking {
        throw new Error("Method not implemented.");
    }
    getAdded(data: any): Booking {
        throw new Error("Method not implemented.");
    }
    getUpdated(data: any): Booking {
        throw new Error("Method not implemented.");
    }
    getDeleted(data: any): Booking {
        throw new Error("Method not implemented.");
    }
    setAdd(data: Booking) {
        throw new Error("Method not implemented.");
    }
    setUpdate(data: any) {
        throw new Error("Method not implemented.");
    }
    
}