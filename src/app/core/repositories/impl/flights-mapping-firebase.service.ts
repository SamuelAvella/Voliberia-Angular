import { Injectable } from "@angular/core";
import { Flight } from "../../models/flight.model";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";

@Injectable({
    providedIn: 'root'
})
export class FlightsMappingFirebaseService implements IBaseMapping<Flight>{
    
    getPaginated(page: number, pageSize: number, pages: number, data: any): Paginated<Flight> {
        throw new Error("Method not implemented.");
    }
    getOne(data: any): Flight {
        throw new Error("Method not implemented.");
    }
    getAdded(data: any): Flight {
        throw new Error("Method not implemented.");
    }
    getUpdated(data: any): Flight {
        throw new Error("Method not implemented.");
    }
    getDeleted(data: any): Flight {
        throw new Error("Method not implemented.");
    }
    setAdd(data: Flight) {
        throw new Error("Method not implemented.");
    }
    setUpdate(data: any) {
        throw new Error("Method not implemented.");
    }

}