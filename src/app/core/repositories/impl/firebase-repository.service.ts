import { Inject, Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, limit, startAt, startAfter, QueryConstraint, orderBy, or, where } from 'firebase/firestore';
import { from, map, Observable, mergeMap } from 'rxjs';

import { IBaseRepository, SearchParams } from '../interfaces/base-repository.interface';
//
import { FIREBASE_CONFIG_TOKEN, FIREBASE_COLLECTION_TOKEN, REPOSITORY_MAPPING_TOKEN } from '../repository.token';
import { IBaseMapping } from '../interfaces/base-mapping.interface';
import { Model } from '../../models/base.model';
import { Paginated } from '../../models/paginated.model';


/**
 * Repositorio genérico Firebase para operaciones CRUD y paginación.
 *
 * @template T Modelo que extiende de `Model`
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseRepositoryService<T extends Model> implements IBaseRepository<T> {
  protected db;
  protected collectionRef;

  /**
   * Constructor del repositorio, inicializa Firebase y referencia la colección correspondiente.
   *
   * @param firebaseConfig Configuración de Firebase (inyectada por token)
   * @param collectionName Nombre de la colección de Firestore
   * @param mapping Servicio de mapeo para transformar datos entre Firebase y modelo interno
   */
  constructor(
    @Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig: any,
    @Inject(FIREBASE_COLLECTION_TOKEN) protected collectionName: string,
    @Inject(REPOSITORY_MAPPING_TOKEN) protected mapping: IBaseMapping<T>
  ) {
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    this.collectionRef = collection(this.db, this.collectionName);
  }

  /**
   * Obtiene el último documento de la página anterior para poder aplicar `startAfter` en la paginación.
   *
   * @param page Número de la página actual
   * @param pageSize Número de elementos por página
   * @returns Último documento de la página anterior (si existe)
   */
  private async getLastDocumentOfPreviousPage(page: number, pageSize: number) {
    if (page <= 1) return null;

    const previousPageQuery = query(
      this.collectionRef,
      limit((page - 1) * pageSize)
    );

    const snapshot = await getDocs(previousPageQuery);
    const docs = snapshot.docs;
    return docs[docs.length - 1];
  }

  /**
   * Obtiene todos los elementos de la colección aplicando paginación y filtros.
   *
   * @param page Número de página actual
   * @param pageSize Tamaño de cada página
   * @param filters Filtros a aplicar en la consulta (por campo)
   * @returns Observable con los elementos paginados
   */
  getAll(page: number, pageSize: number, filters: SearchParams): Observable<T[] | Paginated<T>> {
    return from(this.getLastDocumentOfPreviousPage(page, pageSize)).pipe(
      map(lastDoc => {
        let constraints: QueryConstraint[] = [];
        Object.entries(filters).forEach(([key, value]) => { //NOS QUEDAMOS SOLO CON EL KEY Y EL VALUE

            const start = value;
            const end = start + "\uf8ff";
            constraints.push(where(key, ">=", start));
            constraints.push(where(key, "<", end));

        });

        if (lastDoc) {
          constraints.push(startAfter(lastDoc));
        }

        constraints.push(limit(pageSize));

        let q = query(this.collectionRef, ...constraints);

        return q;
      }),
      mergeMap(q => getDocs(q)),
      map(snapshot => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        return this.mapping.getPaginated(page, pageSize, snapshot.size, items as T[]);
      })
    );
  }

  /**
   * Obtiene un único documento por su ID.
   *
   * @param id ID del documento
   * @returns Observable con el modelo o `null` si no existe
   */
  getById(id: string): Observable<T | null> {
    const docRef = doc(this.db, this.collectionName, id);
    return from(getDoc(docRef)).pipe(
      map(doc => {
        if (doc.exists()) {
          return this.mapping.getOne({ id: doc.id, ...doc.data() } as T);
        }
        return null;
      })
    );
  }

  /**
   * Añade un nuevo documento a la colección.
   *
   * @param entity Entidad a guardar
   * @returns Observable con el modelo añadido
   */
  add(entity: T): Observable<T> {
    return from(addDoc(this.collectionRef, this.mapping.setAdd(entity))).pipe(
      map(docRef => this.mapping.getAdded({ ...entity, id: docRef.id } as T))
    );
  }

  /**
   * Actualiza un documento existente por ID.
   *
   * @param id ID del documento a actualizar
   * @param entity Nuevos datos a aplicar
   * @returns Observable con el modelo actualizado
   */
  update(id: string, entity: T): Observable<T> {
    const docRef = doc(this.db, this.collectionName, id);

    return from(updateDoc(docRef, this.mapping.setUpdate(entity))).pipe(
      map(() => this.mapping.getUpdated({ ...entity, id } as T))
    );
  }

  /**
   * Elimina un documento por ID.
   *
   * @param id ID del documento a eliminar
   * @returns Observable con el modelo eliminado
   */
  delete(id: string): Observable<T> {
    const docRef = doc(this.db, this.collectionName, id);
    return from(getDoc(docRef)).pipe(
      map(doc => ({ id: doc.id, ...doc.data() } as T)),
      map(entity => {
        deleteDoc(docRef);
        return this.mapping.getDeleted(entity);
      })
    );
  }
}
