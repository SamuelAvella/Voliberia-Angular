import { Model } from "./base.model";

/**
 * Roles disponibles para un usuario.
 */
export type UserRole = 'admin' | 'user';

/**
 * Modelo de usuario extendido (UserApp) con información adicional.
 */
export interface UserApp extends Model {
  name: string;
  surname: string;
  idDocument?: string;
  age?: number;
  email?: string;
  role: UserRole;
  picture?: {
    url: string | undefined;
    large: string | undefined;
    medium: string | undefined;
    small: string | undefined;
    thumbnail: string | undefined;
  };
  userId?: string;
  bookingsId?: string | [] | null;
}
