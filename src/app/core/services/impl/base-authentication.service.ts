/**
 * Servicio base abstracto para autenticación de usuarios.
 * Proporciona estado de autenticación, usuario actual y si está listo el sistema.
 */

import { Inject, Injectable } from "@angular/core";
import { IAuthentication } from "../interfaces/authentication.interface";
import { BehaviorSubject, Observable } from "rxjs";
import { IAuthMapping } from "../interfaces/auth-mapping.interface";
import { User } from "../../models/auth.model";


@Injectable({
    providedIn: 'root'
  })
export abstract class BaseAuthenticationService implements IAuthentication{
    /** Estado de autenticación */
    protected _authenticated:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    /** Observable para saber si el usuario está autenticado */
    public authenticated$:Observable<boolean> = this._authenticated.asObservable();
    /** Usuario actual */
    protected _user:BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
    /** Observable del usuario actual */
    public user$:Observable<User | undefined> = this._user.asObservable();
    /** Estado de inicialización */
    protected _ready:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    /** Observable para saber si ya se ha completado la carga */
    public ready$:Observable<boolean> = this._ready.asObservable();
    constructor(
        protected authMapping:IAuthMapping
    ){

    }
    /** Devuelve el usuario actual si está autenticado */
    abstract getCurrentUser(): Promise<any>;

    /** Inicia sesión */
    abstract signIn(authPayload: any): Observable<any>;

    /** Registra un nuevo usuario */
    abstract signUp(registerPayload: any): Observable<any>;

    /** Cierra sesión */
    abstract signOut(): Observable<any>;

    /** Devuelve el usuario autenticado */
    abstract me(): Observable<any>;
}