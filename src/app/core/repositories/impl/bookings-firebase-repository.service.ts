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
    @Inject(FIREBASE_CONFIG_TOKEN) protected override firebaseConfig: any,
    @Inject(FIREBASE_COLLECTION_TOKEN) protected  override collectionName: string,
    @Inject(BOOKINGS_REPOSITORY_MAPPING_TOKEN) mapping: IBaseMapping<Booking>
  ) {
      super(firebaseConfig, collectionName, mapping);

  }
  
    deleteBookingsByFlightId(flightId: string): Observable<void> {
      const bookingsQuery = query(this.collectionRef, where("flight", "==", doc(this.db, "flights", flightId)));

      return from(getDocs(bookingsQuery)).pipe(
        map(snapshot => snapshot.docs.map(doc => doc.ref)), 
        mergeMap(refs => 
          from(Promise.all(refs.map(ref => deleteDoc(ref)))) 
        ),
        map(() => undefined) 
      );
    }

} 