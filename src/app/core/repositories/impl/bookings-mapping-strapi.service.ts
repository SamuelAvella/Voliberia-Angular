import { Injectable } from "@angular/core";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Booking } from "../../models/booking.model";

export interface UserAppRaw {
    data: UserAppData
}

export interface UserAppData {
    id: number
    attributes: UserAppAttributes
}

export interface UserAppAttributes{
    name: string
    surname: string
    idDocument: string
    birthDate?: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

export interface FlightRaw {
    data: FlightData
    meta: Meta
}

export interface FlightData {
    id: number
    attributes: FlighAttributes
}

export interface FlighAttributes{
    origin: string
    destination: string
    departureDate: string
    arrivalDate: string
    seatPrice: number
    createdAt: string
    updatedAt: string
    publishedAt: string
}


export interface BookingRaw {
    data: Data
    meta: Meta
}

export interface Data{
    id: number
    attributes: BookingAttributes
}
export interface BookingData {
    data: BookingAttributes
}

export interface BookingAttributes {
    bookingState: boolean
    createdAt?: string
    updatedAt?: string
    userApp: UserAppRaw | number 
    flight: FlightRaw | number 
}

interface Meta{}

@Injectable({
  providedIn: 'root'
})
export class BookingMappingStrapi implements IBaseMapping<Booking> {
    
    setAdd(data: Booking) : BookingData{
        return {
            data:{
                bookingState:data.bookingState,
                userApp:data.userAppId?Number(data.userAppId): 0,
                flight:data.flightId?Number(data.flightId): 0,
            }
        }
    }

    setUpdate(data: Partial<Booking>) {
        const mappedData: Partial<BookingAttributes> = {};
        
        Object.keys(data).forEach(key => {
            switch(key){
                case 'bookingState' : mappedData.bookingState = data[key];
                break;
                case 'userAppId' : mappedData.userApp = data[key] ? Number(data[key]) : undefined;
                break;
                case 'flightId' : mappedData.flight = data[key] ? Number(data[key]) : undefined;
                break;
            }
        })

        return {
            data: mappedData as BookingAttributes
        }
    }


    getPaginated(page: number, pageSize: number, pages: number, data: Data[]): Paginated<Booking> {
        const validData = data.filter(d => d && d.id && d.attributes);
    
        return {
            page: page,
            pageSize: pageSize,
            pages: pages,
            data: validData.map<Booking>((d: Data | BookingRaw) => this.getOne(d)),
        };
    }
    

    getOne(data: Data | BookingRaw): Booking {
        const isBookingRaw = (data: Data | BookingRaw): data is BookingRaw => 'meta' in data;
    
        // Validar la estructura base
        if (!data) {
            throw new Error('Booking data is undefined or null.');
        }
    
        const attributes = isBookingRaw(data) ? data.data?.attributes : data.attributes;
        const id = isBookingRaw(data) ? data.data?.id : data.id;
    
        // Validar que id y attributes existan
        if (!id) {
            console.log("El id de booking no lo pilla")
        }
        if (!attributes) {
            console.log("Los atributos de booking no los pilla")
        }
    
        return {
            id: id.toString(),
            bookingState: attributes.bookingState || false,
            userAppId: typeof attributes.userApp === 'object' && attributes.userApp?.data
                ? attributes.userApp.data.id.toString()
                : attributes.userApp
                ? attributes.userApp.toString()
                : '',
            flightId: typeof attributes.flight === 'object' && attributes.flight?.data
                ? attributes.flight.data.id.toString()
                : attributes.flight
                ? attributes.flight.toString()
                : '',
        };
    }
    
    getAdded(data: BookingRaw): Booking {
        return this.getOne(data.data);
    }
    getUpdated(data: BookingRaw): Booking {
        return this.getOne(data.data);
    }
    getDeleted(data: BookingRaw): Booking {
        return this.getOne(data.data);
    }

        

  
}
