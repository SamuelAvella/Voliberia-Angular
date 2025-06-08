import { Inject, Injectable } from "@angular/core";
import { UserApp } from "../../models/userApp.model";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Firestore, getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG_TOKEN } from "../repository.token";
import { initializeApp } from "firebase/app";
import { FirebaseUserApp } from "../../models/firebase/firebase-userApp.model";

@Injectable({
    providedIn: 'root'
})
export class UsersAppMappingFirebaseService implements IBaseMapping<UserApp>{
    
    private db: Firestore;
    
    constructor(@Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig: any){
        this.db = getFirestore(initializeApp(firebaseConfig))
    }

    getOne(data: {id: string} & FirebaseUserApp): UserApp {
        return {
            id: data.id,
            name: data.name,
            surname: data.surname,
            userId: data.user || '',
            role: data.role || 'user',
            picture: data.picture ? {
              url: data.picture,
              large: data.picture,
              medium: data.picture,
              small: data.picture,
              thumbnail: data.picture
            } : undefined
        };
    }

    getPaginated(page: number, pageSize: number, total: number, data: ({id: string} & FirebaseUserApp)[]): Paginated<UserApp> {
        return {
            page,
            pageSize,
            pages: Math.ceil(total / pageSize),
            data: data.map(item => this.getOne(item))
        };
    }

    getAdded(data: {id:string} & FirebaseUserApp): UserApp {
        return this.getOne(data);
    }

    getUpdated(data: {id:string} & FirebaseUserApp): UserApp {
        return this.getOne(data);
    }

    getDeleted(data: {id:string} & FirebaseUserApp): UserApp {
        return this.getOne(data);
    }

    setAdd(data: UserApp): FirebaseUserApp {
        return {
            name: data.name,
            surname: data.surname,
            user: data.userId || '',
            picture: data.picture ? data.picture.url : '',
            role: data.role || 'user'
        };
    }

    setUpdate(data: Partial<UserApp>): FirebaseUserApp {
        const result: any = {};

        if (data.name) result.name = data.name;
        if (data.surname) result.surname = data.surname;
        if (data.userId) result.user = data.userId || '';
        if (data.picture) result.picture = data.picture;
        if (data.role) result.role = data.role;

        return result
    }
}