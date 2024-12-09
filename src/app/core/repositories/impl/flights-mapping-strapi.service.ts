import { Injectable } from "@angular/core"
import { Flight } from "../../models/flight.model"
import { IBaseMapping } from "../interfaces/base-mapping.interface"
import { Paginated } from "../../models/paginated.model"

export interface FlightRaw {
    data: Data
    meta: Meta
}

export interface Data{
    id: number
    attributes: FlightAttributes
}

export interface FlightData {
    data: FlightAttributes
}

export interface FlightAttributes {
    origin: string
    destination: string
    departureDate: string
    arrivalDate: string
    seatPrice: number
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

export interface Meta {}

@Injectable({
    providedIn: 'root'
  })
  export class FlightMappingStrapi implements IBaseMapping<Flight> {
    

    setAdd(data: Flight):FlightData {
        return {
            data:{
                origin: data.origin,
                destination: data.destination,
                departureDate: data.departureDate,
                arrivalDate: data.arrivalDate,
                seatPrice: data.seatPrice
            }
        };
    }

    setUpdate(data: Partial<Flight>): FlightData {
        const mappedData: Partial<FlightAttributes> = {};
    
        Object.keys(data).forEach(key => {
            switch(key) {
                case 'origin': 
                    mappedData.origin = data[key] as string;
                    break;
                case 'destination':
                    mappedData.destination = data[key] as string;
                    break;
                case 'departureDate':
                    mappedData.departureDate = data[key] as string;
                    break;
                case 'arrivalDate':
                    mappedData.arrivalDate = data[key] as string;
                    break;
                case 'seatPrice':
                    mappedData.seatPrice = data[key] as number;
                    break;
            }
        });
    
        return {
            data: mappedData as FlightAttributes
        };
    }
    
    
    getPaginated(page:number, pageSize: number, pages:number, data:Data[]): Paginated<Flight> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Flight>((d:Data)=>{
            return this.getOne(d);
        })};
    }
    getOne(data: Data | FlightRaw): Flight {
        const isFlightRaw = (data: Data | FlightRaw): data is FlightRaw => 'meta' in data;
        
        const attributes = isFlightRaw(data) ? data.data.attributes : data.attributes;
        const id = isFlightRaw(data) ? data.data.id : data.id;

        return {
            id: id.toString(),
            origin: attributes.origin,
            destination: attributes.destination,
            departureDate: attributes.departureDate,
            arrivalDate: attributes.arrivalDate,
            seatPrice: attributes.seatPrice
        };
    }
    getAdded(data: FlightRaw):Flight {
        return this.getOne(data.data);
    }
    getUpdated(data: FlightRaw):Flight {
        return this.getOne(data.data);
    }
    getDeleted(data: FlightRaw):Flight {
        return this.getOne(data.data);
    }
  }
  