/**
 * Servicio de autenticación con Firebase.
 * Implementa inicio de sesión, registro, cierre de sesión y observación del estado del usuario.
 */
import { Inject, Injectable } from '@angular/core';
import { filter, map, Observable, of, tap, firstValueFrom, from } from 'rxjs';
import { BaseAuthenticationService } from './base-authentication.service';
import { AUTH_MAPPING_TOKEN, FIREBASE_CONFIG_TOKEN } from '../../repositories/repository.token';
import { IAuthMapping } from '../interfaces/auth-mapping.interface';
import { User } from '../../models/auth.model';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthenticationService extends BaseAuthenticationService {
  private auth;
  private _token: string | null = null;

  constructor(
    @Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig: any,
    @Inject(AUTH_MAPPING_TOKEN) authMapping: IAuthMapping
  ) {
    super(authMapping);
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);

    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this._token = await user.getIdToken();
        this._authenticated.next(true);
        this._user.next(this.authMapping.me(user));
      } else {
        this._token = null;
        this._authenticated.next(false);
        this._user.next(undefined);
      }
      this._ready.next(true);
    });
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
   * Inicia sesión con email y contraseña.
   * @param authPayload Datos del formulario de login
   * @returns Observable con el usuario autenticado
   */
  signIn(authPayload: any): Observable<User> {
    const { email, password } = this.authMapping.signInPayload(authPayload);
    
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(userCredential => {
        return this.authMapping.signIn(userCredential.user);
      })
    );
  }

  /**
   * Registra un nuevo usuario en Firebase.
   * @param signUpPayload Datos del formulario de registro
   * @returns Observable con el usuario registrado
   */
  signUp(signUpPayload: any): Observable<User> {
    const { email, password } = this.authMapping.signUpPayload(signUpPayload);
    
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      map(userCredential => {
        return this.authMapping.signUp(userCredential.user);
      })
    );
  }

  /**
   * Cierra sesión en Firebase.
   * @returns Observable vacío cuando termina
   */
  signOut(): Observable<any> {
    return from(firebaseSignOut(this.auth)).pipe(
      tap(() => {
        this._authenticated.next(false);
        this._user.next(undefined);
      })
    );
  }

  /**
   * Devuelve el usuario actual de Firebase si está autenticado.
   * @returns Observable con el usuario de Firebase
   */
  me(): Observable<any> {
    return of(this.auth.currentUser).pipe(
      map(user => {
        if (!user) {
          throw new Error('No authenticated user');
        }
        return user;
      })
    );
  }

  /**
   * Devuelve el token JWT del usuario actual.
   * @returns Token como string o null
   */
  getToken(): string | null {
    return this._token;
  }
} 