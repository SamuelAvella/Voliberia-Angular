import { Observable } from "rxjs";
import { UserApp } from "../../models/userApp.model";
import { IBaseService } from "../interfaces/base-service.interface";

export interface IUsersAppService extends IBaseService<UserApp>{
    getByUserId(userId: string): Observable<UserApp | null>;
}