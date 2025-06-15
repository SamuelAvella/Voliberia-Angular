/**
 * @file auth.model.ts
 * @description Modelos utilizados para autenticación de usuarios.
 */

/**
 * Datos requeridos para iniciar sesión.
 */
export interface SignInPayload {
  email: string;
  password: string;
}

/**
 * Datos requeridos para registrar un nuevo usuario.
 */
export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
  surname: string;
  birthDate: string;
  user: string;
}

/**
 * Representa a un usuario básico autenticado.
 */
export interface User {
  id: string;
  username: string;
  email: string;
}
