/**
 * Servicio que gestiona las suscripciones en tiempo real a colecciones de Firestore.
 * Se encarga de emitir eventos cuando los documentos se agregan, modifican o eliminan.
 */
import { Inject, Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { Observable, Subject } from 'rxjs';
import { ICollectionSubscription } from '../interfaces/collection-subscription.interface';
import { FIREBASE_CONFIG_TOKEN, REPOSITORY_MAPPING_TOKEN } from '../../repositories/repository.token';
import { Model } from '../../models/base.model';
import { IBaseMapping } from '../../repositories/interfaces/base-mapping.interface';
import { CollectionChange } from '../interfaces/collection-subscription.interface';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCollectionSubscriptionService<T extends Model> implements ICollectionSubscription<T> {
  private db;
  private subscriptions: Map<string, Subject<CollectionChange<T>>> = new Map();
  private unsubscribeFunctions: Map<string, () => void> = new Map();

  /**
   * Inicializa Firebase y el mapeo para convertir datos de Firestore al modelo de la app.
   * @param firebaseConfig Configuración de Firebase inyectada
   * @param mapping Mapeo de datos para transformar los documentos Firestore al modelo T
   */
  constructor(
    @Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig: any,
    @Inject(REPOSITORY_MAPPING_TOKEN) protected mapping: IBaseMapping<T>
  ) {
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  /**
   * Se suscribe a una colección de Firestore y emite los cambios en tiempo real.
   * @param collectionName Nombre de la colección a observar
   * @returns Observable que emite los cambios en la colección
   */
  subscribe(collectionName: string): Observable<CollectionChange<T>> {
    if (this.subscriptions.has(collectionName)) {
      return this.subscriptions.get(collectionName)!.asObservable();
    }

    const subject = new Subject<CollectionChange<T>>();
    this.subscriptions.set(collectionName, subject);

    const unsubscribe = onSnapshot(
      collection(this.db, collectionName),
      (snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.docChanges().forEach(change => {
          const changeData: CollectionChange<T> = {
            type: change.type as 'added' | 'modified' | 'removed',
            id: change.doc.id
          };
          
          if (change.type !== 'removed') {
            changeData.data = this.mapping.getOne({
              id: change.doc.id,
              ...change.doc.data()
            } as T);
          }
          
          subject.next(changeData);
        });
      },
      error => {
        console.error(`Error en suscripción a ${collectionName}:`, error);
        subject.error(error);
      }
    );

    this.unsubscribeFunctions.set(collectionName, unsubscribe);
    return subject.asObservable();
  }

  /**
   * Cancela la suscripción activa a una colección específica.
   * @param collectionName Nombre de la colección
   */
  unsubscribe(collectionName: string): void {
    const unsubscribe = this.unsubscribeFunctions.get(collectionName);
    if (unsubscribe) {
      unsubscribe();
      this.unsubscribeFunctions.delete(collectionName);
    }

    const subject = this.subscriptions.get(collectionName);
    if (subject) {
      subject.complete();
      this.subscriptions.delete(collectionName);
    }
  }

  /**
   * Limpia todas las suscripciones al destruirse el servicio.
   */
  ngOnDestroy() {
    // Limpiar todas las suscripciones al destruir el servicio
    this.unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    this.subscriptions.forEach(subject => subject.complete());
    this.unsubscribeFunctions.clear();
    this.subscriptions.clear();
  }
} 