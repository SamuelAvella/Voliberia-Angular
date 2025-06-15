/**
 * Servicio que implementa el mapeo entre los datos de autenticación de Firebase
 * y el modelo de usuario (`User`) usado en la aplicación.
 * Adapta tanto los payloads de entrada como las respuestas del SDK de Firebase.
 */
import { Injectable } from "@angular/core";
import { IAuthMapping } from "../interfaces/auth-mapping.interface";
import { SignInPayload, SignUpPayload, User } from "../../models/auth.model";
import { UserCredential, User as FirebaseUser } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthMappingService implements IAuthMapping {
  
  /**
   * Transforma los datos del formulario de inicio de sesión
   * al formato que espera Firebase (email y password).
   * 
   * @param payload Datos del formulario de inicio de sesión
   * @returns Objeto con `email` y `password`
   */
  signInPayload(payload: SignInPayload): { email: string, password: string } {
    return {
      email: payload.email,
      password: payload.password
    };
  }

  /**
   * Transforma los datos del formulario de registro al formato requerido por Firebase.
   * 
   * @param payload Datos del formulario de registro
   * @returns Objeto con `email` y `password` (Firebase no requiere username)
   */
  signUpPayload(payload: SignUpPayload): { email: string, password: string } {
    return {
      email: payload.email,
      password: payload.password
      // No necesitamos username ya que Firebase no lo maneja por defecto
    };
  }

  /**
   * Mapea el usuario devuelto por Firebase tras iniciar sesión al modelo `User` de la app.
   * 
   * @param response Usuario Firebase (`FirebaseUser`)
   * @returns Usuario en formato propio
   */
  signIn(response: FirebaseUser): User {
    return {
      id: response.uid,
      username: response.displayName || response.email || '',
      email: response.email || ''
    };
  }

   /**
   * Mapea el usuario devuelto por Firebase tras el registro al modelo `User`.
   * 
   * @param response Usuario Firebase (`FirebaseUser`)
   * @returns Usuario en formato propio
   */
  signUp(response: FirebaseUser): User {
    return {
      id: response.uid,
      username: response.displayName || response.email || '',
      email: response.email || ''
    };
  }

   /**
   * Mapea el usuario actual autenticado (por ejemplo, al hacer `me()`).
   * 
   * @param response Usuario Firebase autenticado (`FirebaseUser`)
   * @returns Usuario en formato propio
   */
  me(response: FirebaseUser): User {
    return {
      id: response.uid,
      username: response.displayName || response.email || '',
      email: response.email || ''
    };
  }
} 