/**
 * Servicio de subida de archivos a Firebase Storage.
 * Hereda de `BaseMediaService` y utiliza el usuario autenticado para añadir metadatos.
 */
import { Inject, Injectable } from "@angular/core";
import { BaseMediaService } from "./base-media.service";
import { 
  getStorage, 
  ref, 
  uploadBytes,
  getDownloadURL,
  StorageReference 
} from "firebase/storage";
import { from, map, Observable, switchMap } from "rxjs";
import { AUTH_TOKEN, FIREBASE_CONFIG_TOKEN } from "../../repositories/repository.token";
import { initializeApp } from "firebase/app";
import { IAuthentication } from "../interfaces/authentication.interface";

@Injectable({
  providedIn: 'root'
})
export class FirebaseMediaService extends BaseMediaService<string> {
  private storage;

  /**
   * Constructor que inicializa Firebase Storage y la configuración necesaria.
   * @param firebaseConfig Configuración de Firebase
   * @param auth Servicio de autenticación que proporciona el usuario actual
   */
  constructor(
    @Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig: any,
    @Inject(AUTH_TOKEN) private auth: IAuthentication
  ) {
    super();
    const app = initializeApp(firebaseConfig);
    this.storage = getStorage(app);
  }

  /**
   * Sube un archivo en formato `Blob` al bucket de Firebase Storage.
   * El nombre del archivo se genera aleatoriamente con timestamp y hash.
   * Se incluyen metadatos personalizados con el ID del usuario autenticado.
   *
   * @param blob Archivo a subir
   * @returns Observable con una lista que contiene la URL pública del archivo
   */
  public upload(blob: Blob): Observable<string[]> {
    return from(this.auth.getCurrentUser()).pipe(
      switchMap(user => {
        if (!user) throw new Error('Usuario no autenticado');
        
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}`;
        const storageRef: StorageReference = ref(this.storage, `uploads/${fileName}`);

        const metadata = {
          contentType: blob.type,
          customMetadata: {
            'uploaded-by': user.id || 'anonymous'
          }
        };

        return from(uploadBytes(storageRef, blob, metadata)).pipe(
          switchMap(snapshot => getDownloadURL(snapshot.ref)),
          map(url => [url])
        );
      })
    );
  }
} 