import { Model } from "./base.model";

export type UserRole = 'admin' | 'user';

export interface UserApp extends Model{
    name:string,
    surname:string,
    idDocument?:string,
    age?:number,
    email?:string,
    role: 'admin' | 'user',
    picture?:{
        url:string | undefined,
        large:string | undefined,
        medium:string | undefined,
        small:string | undefined,
        thumbnail:string | undefined
    },
    userId?:string,
    bookingsId?: string | [] | null
}