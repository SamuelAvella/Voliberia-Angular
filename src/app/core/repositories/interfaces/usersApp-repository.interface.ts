import { Observable } from "rxjs";
import { UserApp } from "../../models/userApp.model";
import { IBaseRepository } from "./base-repository.interface";

export interface IUsersAppRepository extends IBaseRepository<UserApp>{
    getByUserId(userId: string): Observable<UserApp | null> 
}