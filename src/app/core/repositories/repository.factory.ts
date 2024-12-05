import { FactoryProvider, InjectionToken } from "@angular/core";
import { Model } from "../models/base.model";
import { IBaseRepository } from "./interfaces/base-repository.interface";
import { HttpClient } from "@angular/common/http";
import { IBaseMapping } from "./interfaces/base-mapping.interface";
import { BaseRepositoryHttpService } from "./impl/base-repository-http.service";
import { StrapiRepositoryService } from "./impl/strapi-repository.service";
import { IStrapiAuthentication } from "../services/interfaces/strapi-authentication.interface";

export function createBaseRepositoryFactory<T extends Model>(
    token: InjectionToken<IBaseRepository<T>>,
    dependencies:any[]) : FactoryProvider{

    return {
        provide: token,
        useFactory: (backend: string, http: HttpClient, auth:IStrapiAuthentication, apiURL: string, resource: string, mapping: IBaseMapping<T>) => {
            switch(backend){
                case 'http':
                    return new BaseRepositoryHttpService<T>(http, auth, apiURL, resource, mapping);
                case 'strapi':
                    return new StrapiRepositoryService<T>(http, auth, apiURL, resource, mapping);
                default:
                    throw new Error("BACKEND NOT IMPLEMENTED");
            }
        },
        deps: dependencies
    };
};

export function createBaseMappingFactory<T extends Model>(
    token: InjectionToken<IBaseMapping<T>>,
    dependencies: any[],
    modelType: 'userApp' | 'booking' | 'flight' | 'seat'
): FactoryProvider {
    return {
        provide: token,
        useFactory: (backend: string) => {
            switch (backend) {
              case 'strapi':
                return null //modelType === 'userApp'
                  //? new PeopleMappingStrapi()
                  //: modelType === 'booking' new GroupsMappingStrapi();
              default:
                throw new Error("BACKEND NOT IMPLEMENTED");
            }
          },
    }
}
