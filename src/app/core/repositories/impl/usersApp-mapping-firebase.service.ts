import { Inject, Injectable } from "@angular/core";
import { UserApp } from "../../models/userApp.model";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Firestore, getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG_TOKEN } from "../repository.token";
import { initializeApp } from "firebase/app";
import { FirebaseUserApp } from "../../models/firebase/firebase-userApp.model";


/**
 * Servicio que implementa el mapeo de datos entre el modelo interno `UserApp` y el modelo de Firebase.
 */
@Injectable({
    providedIn: 'root'
})
export class UsersAppMappingFirebaseService implements IBaseMapping<UserApp>{

  private db: Firestore;

  /**
   * Inicializa Firestore a partir de la configuración proporcionada.
   * @param firebaseConfig Configuración del proyecto Firebase
   */
  constructor(@Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig: any){
      this.db = getFirestore(initializeApp(firebaseConfig))
  }

  /**
   * Convierte un documento de Firebase a un modelo `UserApp`.
   * @param data Datos del usuario obtenidos de Firebase
   * @returns Instancia de `UserApp`
   */
  getOne(data: {id: string} & FirebaseUserApp): UserApp {
      return {
          id: data.id,
          name: data.name,
          surname: data.surname,
          userId: data.user || '',
          role: data.role || 'user',
          picture: data.picture ? {
            url: data.picture,
            large: data.picture,
            medium: data.picture,
            small: data.picture,
            thumbnail: data.picture
          } : undefined
      };
  }

  /**
   * Devuelve un objeto paginado a partir de los datos recibidos de Firebase.
   * @param page Página actual
   * @param pageSize Tamaño de página
   * @param total Total de elementos
   * @param data Array de datos en formato Firebase
   * @returns Datos paginados como instancias `UserApp`
   */
  getPaginated(page: number, pageSize: number, total: number, data: ({id: string} & FirebaseUserApp)[]): Paginated<UserApp> {
      return {
          page,
          pageSize,
          pages: Math.ceil(total / pageSize),
          data: data.map(item => this.getOne(item))
      };
  }

  /**
   * Convierte un modelo de UserApp en un documento compatible con Firebase.
   * Se utiliza para la operación de creación.
   *
   * @param data Objeto UserApp
   * @returns Objeto FirebaseUserApp listo para almacenar en Firestore
   */
  getAdded(data: {id:string} & FirebaseUserApp): UserApp {
      return this.getOne(data);
  }

  /**
   * Convierte un modelo de UserApp actualizado en un documento compatible con Firebase.
   *
   * @param data Objeto UserApp
   * @returns Objeto FirebaseUserApp con los datos actualizados
   */
  getUpdated(data: {id:string} & FirebaseUserApp): UserApp {
      return this.getOne(data);
  }

  /**
   * Obtiene los datos necesarios para eliminar un documento de Firebase.
   *
   * @param data Objeto UserApp
   * @returns Objeto FirebaseUserApp con los datos a eliminar
   */
  getDeleted(data: {id:string} & FirebaseUserApp): UserApp {
      return this.getOne(data);
  }

  /**
   * Convierte un modelo `UserApp` en un objeto compatible con Firebase.
   * @param data Usuario a añadir
   * @returns Objeto con estructura de Firebase
   */
  setAdd(data: UserApp): FirebaseUserApp {
      return {
          name: data.name,
          surname: data.surname,
          user: data.userId || '',
          picture: data.picture ? data.picture.url : '',
          role: data.role || 'user'
      };
  }

  /**
   * Convierte una parte de un modelo `UserApp` en un objeto actualizado para Firebase.
   * @param data Campos modificados del usuario
   * @returns Objeto con estructura de Firebase
   */
  setUpdate(data: Partial<UserApp>): FirebaseUserApp {
      const result: any = {};

      if (data.name) result.name = data.name;
      if (data.surname) result.surname = data.surname;
      if (data.userId) result.user = data.userId || '';
      if (data.picture) result.picture = data.picture;
      if (data.role) result.role = data.role;

      return result
  }
}
