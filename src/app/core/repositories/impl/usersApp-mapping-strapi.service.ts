import { Injectable } from "@angular/core";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { StrapiMedia } from "../../services/impl/strapi-media.service";
import { UserApp } from "../../models/userApp.model";


interface MediaRaw{
    data: StrapiMedia
}
interface UserRaw{
    data: UserData
}

interface UserData{
    id: number
    attributes: UserAttributes
}

interface UserAttributes {
    username: string
    email: string
    provider: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
}

interface BookingRaw{
    data: BookingData,
    meta: Meta
}

interface BookingData {
    id: number
    attributes: BookingAttributes
}
  
interface BookingAttributes {
    bookingState: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
}
  

interface UserAppRaw {
    data: Data
    meta: Meta
  }
  
interface Data {
    id: number
    attributes: UserAppAttributes
}
interface UserAppData {
    data: UserAppAttributes;
}

interface UserAppAttributes {
    name: string
    surname: string
    idDocument: string
    birthdate?: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
    bookings:BookingRaw | number | null,
    user:UserRaw | number | null,
    picture:MediaRaw | number | null
}

interface BookingAttributes {
    name: string
}

interface Meta {}

@Injectable({
    providedIn: 'root'
  })
  export class PeopleMappingStrapi implements IBaseMapping<UserApp> {
    
    setAdd(data: UserApp):UserAppData {
        return {
            data:{
                name:data.name,
                surname:data.surname,
                idDocument:data.idDocument,
                bookings:data.bookingsId?Number(data.bookingsId):null,
                user:data.userId?Number(data.userId):null,
                picture:data.picture?Number(data.picture):null
            }
        };
    }
    setUpdate(data: Partial<UserApp>): UserAppData {
        const mappedData: Partial<UserAppAttributes> = {};

        Object.keys(data).forEach(key => {
            switch(key){
                case 'name': mappedData.name = data[key];
                break;
                case 'surname': mappedData.surname = data[key];
                break;
                case 'idDocument': mappedData.idDocument = data[key];
                break;
                case 'bookingsId': mappedData.bookings = data[key] ? Number(data[key]) : null;
                break;
                case 'userId': mappedData.user = data[key] ? Number(data[key]) : null;
                break;
                case 'picture': mappedData.picture = data[key] ? Number(data[key]) : null;
                break;
            }
        });

        return {
            data: mappedData as UserAppAttributes
        };
    }

    getPaginated(page:number, pageSize: number, pages:number, data:Data[]): Paginated<UserApp> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<UserApp>((d:Data|UserAppRaw)=>{
            return this.getOne(d);
        })};
    }
    getOne(data: Data | UserAppRaw): UserApp {
        const isPersonRaw = (data: Data | UserAppRaw): data is UserAppRaw => 'meta' in data;

        const attributes = isPersonRaw(data) ? data.data.attributes : data.attributes;
        const id = isPersonRaw(data) ? data.data.id : data.id;
        
        return {
            id: id.toString(),
            name: attributes.name,
            surname: attributes.surname,
            idDocument: attributes.idDocument,
            bookingsId: typeof attributes.bookings === 'object' ? attributes.bookings?.data?.id.toString() : undefined,
            userId: typeof attributes.user === 'object' ? attributes.user?.data?.id.toString() : undefined,
            picture: typeof attributes.picture === 'object' ? {
                url: attributes.picture?.data?.attributes?.url,
                large: attributes.picture?.data?.attributes?.formats?.large?.url || attributes.picture?.data?.attributes?.url,
                medium: attributes.picture?.data?.attributes?.formats?.medium?.url || attributes.picture?.data?.attributes?.url,
                small: attributes.picture?.data?.attributes?.formats?.small?.url || attributes.picture?.data?.attributes?.url,
                thumbnail: attributes.picture?.data?.attributes?.formats?.thumbnail?.url || attributes.picture?.data?.attributes?.url,
            } : undefined
        };
    }
    getAdded(data: UserAppRaw):UserApp {
        return this.getOne(data.data);
    }
    getUpdated(data: UserAppRaw):UserApp {
        return this.getOne(data.data);
    }
    getDeleted(data: UserAppRaw):UserApp {
        return this.getOne(data.data);
    }
  }
  