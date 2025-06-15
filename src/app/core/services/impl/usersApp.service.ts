/**
 * Servicio que gestiona operaciones relacionadas con los usuarios extendidos (`UserApp`).
 * Hereda operaciones CRUD de `BaseService` y añade funciones específicas.
 */
import { Inject, Injectable } from "@angular/core";
import { BaseService } from "./base-service.service";
import { USERSAPP_REPOSITORY_TOKEN } from "../../repositories/repository.token";
import { IUsersAppService } from "../interfaces/usersApp-services.interface";
import { IUsersAppRepository } from "../../repositories/interfaces/usersApp-repository.interface";
import { map, Observable } from "rxjs";
import { UserApp } from "../../models/userApp.model";

@Injectable({
    providedIn: 'root'
})

export class UsersAppService extends BaseService<UserApp> implements IUsersAppService{
    /**
   * Inyecta el repositorio correspondiente a `UserApp`.
   * @param repository Repositorio inyectado con token de usuarios extendidos
   */
    constructor(
        @Inject(USERSAPP_REPOSITORY_TOKEN) repository: IUsersAppRepository
    ) {
        super(repository);
    }

     /**
   * Obtiene el `UserApp` asociado a un `userId`.
   * Utiliza un filtro en la llamada `getAll()` para obtener el usuario relacionado.
   * 
   * @param userId ID del usuario base (`User`)
   * @returns Observable con el `UserApp` o `null` si no existe
   */
    getByUserId(userId: string): Observable<UserApp | null> {
        return this.repository.getAll(1, 1, {user: userId}).pipe(
          map(res => Array.isArray(res) ? res[0] || null : res.data[0] || null)
        );
    }
}