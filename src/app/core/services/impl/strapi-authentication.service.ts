/**
 * Servicio de autenticación para el backend Strapi.
 * Maneja inicio de sesión, registro, obtención del usuario y cierre de sesión.
 * Usa JWT almacenado localmente.
 */
import { Inject, Injectable } from '@angular/core';
import { filter, map, Observable, of, switchMap, take, tap, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IAuthMapping } from '../interfaces/auth-mapping.interface';
import { StrapiMeResponse, StrapiSignInResponse, StrapiSignUpResponse } from './strapi-auth-mapping.service';
import { IStrapiAuthentication } from '../interfaces/strapi-authentication.interface';
import { User } from '../../models/auth.model';
import { BaseAuthenticationService } from './base-authentication.service';
import { AUTH_MAPPING_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN } from '../../repositories/repository.token';

@Injectable({
  providedIn: 'root'
})
export class StrapiAuthenticationService extends BaseAuthenticationService implements IStrapiAuthentication {
  /**Token JWT del usuario */
  private jwt_token:string|null = null;

  /**
   * Constructor que configura las URLs de autenticación y obtiene el token si existe en localStorage.
   * También inicializa el usuario actual si ya está autenticado.
   *
   * @param signInUrl URL para iniciar sesión
   * @param signUpUrl URL para registrarse
   * @param meUrl URL para obtener los datos del usuario autenticado
   * @param authMapping Mapeador entre datos de Strapi y el modelo interno
   * @param httpClient Cliente HTTP de Angular
   */
  constructor(
    @Inject(AUTH_SIGN_IN_API_URL_TOKEN) protected signInUrl: string,
    @Inject(AUTH_SIGN_UP_API_URL_TOKEN) protected signUpUrl: string,
    @Inject(AUTH_ME_API_URL_TOKEN) protected meUrl: string,
    @Inject(AUTH_MAPPING_TOKEN) authMapping: IAuthMapping,
    private httpClient:HttpClient
  ) {
    super(authMapping);
    this.jwt_token = localStorage.getItem('user-apps-jwt-token');
    if (this.jwt_token) {
      this.me().subscribe({
        next:(resp) => {
          this._authenticated.next(true);
          this._user.next(this.authMapping.me(resp));
        },
        error: (err) => {
          this._authenticated.next(false);
          this._user.next(undefined);
        },
        complete:() => {
          this._ready.next(true); // Completar inicialización
        }
      });
    } else {
      this._ready.next(true); // Completar inicialización
    }
    
  }

  /**
   * Devuelve el token JWT actual.
   * @returns Token JWT o null
   */
  getToken(): string | null {
    return this.jwt_token;
  }

  /**
   * Espera a que el servicio esté listo y devuelve el usuario actual.
   * @returns Promesa con el usuario autenticado o undefined
   */
  async getCurrentUser(): Promise<any> {
    await firstValueFrom(this._ready.pipe(filter(ready => ready === true)));
    return firstValueFrom(this._user);
  }

  /**
   * Inicia sesión en Strapi y guarda el token JWT.
   * @param authPayload Datos del formulario de login
   * @returns Observable con el usuario autenticado
   */
  signIn(authPayload: any): Observable<User> {
    return this.httpClient.post<StrapiSignInResponse>(
      `${this.signInUrl}`, 
      this.authMapping.signInPayload(authPayload)).pipe(map((resp:StrapiSignInResponse)=>{
      localStorage.setItem("user-apps-jwt-token",resp.jwt);
      this.jwt_token = resp.jwt;
      this._authenticated.next(true);
      this._user.next(this.authMapping.signIn(resp));
      return this.authMapping.signIn(resp);
    }));
  }

  /**
   * Registra un nuevo usuario en Strapi y guarda el token JWT.
   * @param signUpPayload Datos del formulario de registro
   * @returns Observable con el usuario registrado
   */
  signUp(signUpPayload: any): Observable<User> {
    return this.httpClient.post<StrapiSignUpResponse>(
      `${this.signUpUrl}`, 
      this.authMapping.signUpPayload(signUpPayload)).pipe(map((resp:StrapiSignUpResponse)=>{
        localStorage.setItem("user-apps-jwt-token",resp.jwt);
        this.jwt_token = resp.jwt;
        this._authenticated.next(true);
        return this.authMapping.signUp(resp);
      }));
  }

    /**
   * Cierra sesión y elimina el token JWT del almacenamiento local.
   * @returns Observable vacío al finalizar
   */
  signOut(): Observable<any> {
    return of(true).pipe(tap(_=>{
      localStorage.removeItem('user-apps-jwt-token');
      this._authenticated.next(false);
      this._user.next(undefined);
    }));
  }

  /**
   * Obtiene los datos del usuario autenticado mediante una llamada a `/me`.
   * @returns Observable con la respuesta del backend Strapi
   */
  me():Observable<any>{
    return this.httpClient.get<StrapiMeResponse>(
      `${this.meUrl}`,{headers:{Authorization: `Bearer ${this.jwt_token}`}});
  }
}
