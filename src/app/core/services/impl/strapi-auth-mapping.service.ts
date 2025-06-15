/**
 * Implementación de `IAuthMapping` para adaptarse a la API de autenticación de Strapi.
 * Mapea los payloads de login/registro y las respuestas del servidor al modelo `User` de la app.
 */

import { Injectable } from "@angular/core";
import { IAuthMapping } from "../interfaces/auth-mapping.interface";
import { SignInPayload, SignUpPayload, User } from "../../models/auth.model";


export interface StrapiMeResponse {
    id: number
    username: string
    email: string
    provider: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
}

export interface StrapiSignInResponse {
    jwt: string
    user: StrapiUser
  }

export interface StrapiSignUpResponse {
    jwt: string
    user: StrapiUser
  }
  
  export interface StrapiUser {
    id: number
    username: string
    email: string
    provider: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
  }
  

interface StrapiSignIn{
    identifier:string,
    password:string
}

interface StrapiSignUp{
    email:string,
    password:string,
    username:string
}

@Injectable({
    providedIn: 'root'
  })
  export class StrapiAuthMappingService implements IAuthMapping {
    /**
     * Convierte el payload del formulario de login al formato esperado por Strapi.
     * @param payload Datos de entrada del usuario (email, password)
     * @returns Objeto con `identifier` y `password`
     */
    signInPayload(payload: SignInPayload):StrapiSignIn{
        return {
            identifier:payload.email,
            password:payload.password
        };
    }

    /**
   * Convierte el payload del formulario de registro al formato requerido por Strapi.
   * @param payload Datos del formulario de registro
   * @returns Objeto con `email`, `password` y `username`
   */
    signUpPayload(payload: SignUpPayload):StrapiSignUp {
        return {
            email:payload.email,
            password:payload.password,
            username:payload.name + " "+ payload.surname
        };
    }

    /**
   * Mapea la respuesta de login de Strapi al modelo `User`.
   * @param response Respuesta con token JWT y datos del usuario
   * @returns Usuario transformado al modelo de la app
   */
    signIn(response: StrapiSignInResponse): User {
        return {
            id:response.user.id.toString(),
            username:response.user.username,
            email:response.user.email
        };
    }

    /**
   * Mapea la respuesta de registro de Strapi al modelo `User`.
   * @param response Respuesta con token JWT y datos del usuario
   * @returns Usuario transformado al modelo de la app
   */
    signUp(response: StrapiSignUpResponse): User {
        return {
            id:response.user.id.toString(),
            username:response.user.username,
            email:response.user.email
        };
    }

    /**
   * Mapea la respuesta de `/me` de Strapi al modelo `User`.
   * @param response Datos del usuario autenticado
   * @returns Usuario transformado
   */
    me(response: StrapiMeResponse): User {
        return {
            id:response.id.toString(),
            username:response.username,
            email:response.email
        };
    }
    
  }
  