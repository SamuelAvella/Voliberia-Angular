import { Inject, Injectable } from '@angular/core';
import { IBaseRepository, SearchParams } from '../interfaces/base-repository.interface';
import { HttpClient } from '@angular/common/http';
import { API_URL_TOKEN, AUTH_MAPPING_TOKEN, AUTH_TOKEN, REPOSITORY_MAPPING_TOKEN, RESOURCE_NAME_TOKEN } from '../repository.token';
import { Model } from '../../models/base.model';
import { map, Observable } from 'rxjs';
import { Paginated } from '../../models/paginated.model';
import { IBaseMapping } from '../interfaces/base-mapping.interface';
import { IAuthentication } from '../../services/interfaces/authentication.interface';

@Injectable({
    providedIn:'root'
})

export class BaseRepositoryHttpService<T extends Model> implements IBaseRepository<T>{

    constructor(
        protected http: HttpClient,
        @Inject(AUTH_TOKEN) protected auth: IAuthentication,
        @Inject(API_URL_TOKEN) protected apiUrl: string,
        @Inject(RESOURCE_NAME_TOKEN) protected resource:string,
        @Inject(REPOSITORY_MAPPING_TOKEN) protected mapping:IBaseMapping<T>
    ) {
        this.apiUrl = apiUrl;
    }

    getAll(page: number, pageSize: number, filters: SearchParams): Observable<T[] | Paginated<T>> {
        return this.http.get<T[]>(`${this.apiUrl}/${this.resource}`).pipe(
            map((res: any) => {
                if (!res || !res.data) {
                    throw new Error(`Invalid API response for resource ${this.resource}`);
                }
                return this.mapping.getPaginated(page, pageSize, 0, res.data);
            }));
    }

    getById(id: string): Observable<T | null> {
        return this.http.get<T>(`${this.apiUrl}/${this.resource}/${id}`).pipe(map(res=>this.mapping.getOne(res)));
    }

    add(entity: T): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}/${this.resource}`, entity).pipe(map(res=>this.mapping.getAdded(res)));
    }

    update(id: string, entity: T): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}/${this.resource}/${id}`, entity).pipe(map(res=>this.mapping.getUpdated(res)));
    }

    delete(id: string): Observable<T> {
        return this.http.delete<T>(`${this.apiUrl}/${this.resource}/${id}`).pipe(map(res=>this.mapping.getDeleted(res)));
    }
}


