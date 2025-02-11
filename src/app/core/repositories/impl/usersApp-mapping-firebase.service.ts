import { Injectable } from "@angular/core";
import { UserApp } from "../../models/userApp.model";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";

@Injectable({
    providedIn: 'root'
})
export class UsersAppMappingFirebaseService implements IBaseMapping<UserApp>{
    
    getPaginated(page: number, pageSize: number, pages: number, data: any): Paginated<UserApp> {
        throw new Error("Method not implemented.");
    }
    getOne(data: any): UserApp {
        throw new Error("Method not implemented.");
    }
    getAdded(data: any): UserApp {
        throw new Error("Method not implemented.");
    }
    getUpdated(data: any): UserApp {
        throw new Error("Method not implemented.");
    }
    getDeleted(data: any): UserApp {
        throw new Error("Method not implemented.");
    }
    setAdd(data: UserApp) {
        throw new Error("Method not implemented.");
    }
    setUpdate(data: any) {
        throw new Error("Method not implemented.");
    }
}