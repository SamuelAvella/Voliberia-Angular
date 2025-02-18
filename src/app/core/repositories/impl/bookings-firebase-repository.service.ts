import { Inject, Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  limit,
  startAt,
  startAfter,
  QueryConstraint,
  orderBy,
  or,
  where
} from 'firebase/firestore';
import { from, map, Observable, mergeMap } from 'rxjs';

import { IBaseRepository, SearchParams } from '../interfaces/base-repository.interface';
//
import { FIREBASE_CONFIG_TOKEN, FIREBASE_COLLECTION_TOKEN, REPOSITORY_MAPPING_TOKEN, BOOKINGS_REPOSITORY_MAPPING_TOKEN } from '../repository.token';
import { IBaseMapping } from '../interfaces/base-mapping.interface';
import { Model } from '../../models/base.model';
import { Paginated } from '../../models/paginated.model';
import { FirebaseRepositoryService } from './firebase-repository.service';
import { Booking } from '../../models/booking.model';
import { IBookingsRepository } from '../interfaces/bookings-repository.interface';

@Injectable({
  providedIn: 'root'
})
export class BookingsFirebaseRepositoryService extends FirebaseRepositoryService<Booking> implements IBookingsRepository {


  constructor(
    @Inject(FIREBASE_CONFIG_TOKEN) override firebaseConfig: any,
    @Inject(FIREBASE_COLLECTION_TOKEN) override collectionName: string,
    @Inject(BOOKINGS_REPOSITORY_MAPPING_TOKEN) override mapping: IBaseMapping<Booking>
  ) {
      super(firebaseConfig, collectionName, mapping);
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    this.collectionRef = collection(this.db, this.collectionName);
  }
  
    deleteBookingsByFlightId(flightId: string): Observable<void> {
        const q = query(this.collectionRef, where("flight.id", "==", flightId));

        return from(getDocs(q)).pipe(
        mergeMap(snapshot => {
            const deleteOps = snapshot.docs.map(doc => deleteDoc(doc.ref));
            return from(Promise.all(deleteOps));
        }),
        map(() => undefined)
        );
    }

} 