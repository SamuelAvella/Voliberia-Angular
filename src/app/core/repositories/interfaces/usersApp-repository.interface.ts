/**
 * @file usersApp-repository.interface.ts
 * @description Repositorio especializado para el modelo UserApp.
 */

import { Observable } from "rxjs";
import { UserApp } from "../../models/userApp.model";
import { IBaseRepository } from "./base-repository.interface";

/**
 * Repositorio para usuarios extendidos.
 */
export interface IUsersAppRepository extends IBaseRepository<UserApp> {
  getByUserId(userId: string): Observable<UserApp | null>;
}
