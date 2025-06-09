/**
 * Modelo de usuario extendido en Firebase.
 */
export interface FirebaseUserApp {
  name: string;
  surname: string;
  /** ID del usuario autenticado */
  user?: string;
  /** URL de imagen de perfil */
  picture?: string;
  /** Rol asignado al usuario */
  role: 'admin' | 'user';
}
