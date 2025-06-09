import { Inject, Injectable } from "@angular/core";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Booking, BookingState } from "../../models/booking.model";
import { Paginated } from "../../models/paginated.model";
import { doc, Firestore, getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG_TOKEN } from "../repository.token";
import { initializeApp } from "firebase/app";
import { FirebaseBooking } from "../../models/firebase/firebase-booking.model";

/**
 * Sanitiza el estado de la reserva asegurando que solo sea uno de los valores válidos.
 *
 * @param state Estado recibido desde Firebase
 * @returns Estado válido del tipo BookingState
 */
const sanitizeBookingState = (state: any): BookingState => {
  return ['pending', 'confirm', 'cancelled'].includes(state) ? state : 'cancelled';
};

/**
 * Servicio de mapeo para el modelo `Booking` en Firebase.
 * Se encarga de convertir entre el modelo interno (`Booking`) y el modelo de Firebase (`FirebaseBooking`).
 */
@Injectable({
    providedIn: 'root'
})
export class BookingsMappingFirebaseService implements IBaseMapping<Booking>{

  private db: Firestore;

  /**
   * Constructor que inicializa la conexión con Firestore.
   *
   * @param firebaseConfig Configuración del proyecto Firebase
   */
  constructor(@Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig: any){
      this.db = getFirestore(initializeApp(firebaseConfig))
  }

  /**
   * Convierte un documento de Firebase en un modelo interno de Booking.
   *
   * @param id ID del documento
   * @param data Datos en formato FirebaseBooking
   * @returns Objeto Booking adaptado
   */
  getOne(data: {id: string} & FirebaseBooking): Booking {
      return {
          id: data.id,
          bookingState: sanitizeBookingState(data.bookingState),
          flightId: data.flight?.id || data.flight?.path?.split('/').pop() || '',
          userAppId: data.user_app?.id || data.user_app?.path?.split('/').pop() || '',
      }
  }

  /**
   * Transforma una lista de resultados paginados de Firebase.
   * En este caso no se implementa paginación real, se devuelve directamente.
   *
   * @param data Array de Booking
   * @param total Total de elementos
   * @param page Página actual
   * @param pageSize Tamaño de página
   * @returns Objeto con estructura paginada
   */
  getPaginated(page: number, pageSize: number, total: number, data: ({id:string} & FirebaseBooking)[]): Paginated<Booking> {
      return {
          page,
          pageSize,
          pages: Math.ceil(total / pageSize),
          data: data.map(item => this.getOne(item))
        };
  }

  /**
   * Convierte un modelo de Booking en un documento compatible con Firebase.
   * Se utiliza para la operación de creación.
   *
   * @param data Objeto Booking
   * @returns Objeto FirebaseBooking listo para almacenar en Firestore
   */
  getAdded(data: {id:string} & FirebaseBooking): Booking {
      return this.getOne(data);
  }

  /**
   * Convierte un modelo de Booking actualizado en un documento compatible con Firebase.
   *
   * @param data Objeto Booking
   * @returns Objeto FirebaseBooking con los datos actualizados
   */
  getUpdated(data: {id:string} & FirebaseBooking): Booking {
      return this.getOne(data);
  }

  /**
   * Obtiene los datos necesarios para eliminar un documento de Firebase.
   *
   * @param data Objeto Booking
   * @returns Objeto FirebaseBooking con los datos a eliminar
   */
  getDeleted(data: {id:string} & FirebaseBooking): Booking {
      return this.getOne(data);
  }

  /**
   * Convierte un objeto `Booking` a `FirebaseBooking` con referencias para creación en Firebase.
   *
   * @param data Objeto interno `Booking`
   * @returns Objeto `FirebaseBooking` con referencias
   */
  setAdd(data: Booking): FirebaseBooking {
    console.log('[setAdd - Firebase] Recibo:', data);

    const result: any = {
      bookingState: sanitizeBookingState(data.bookingState)
    };

    if (data.flightId) {
      result.flight = doc(this.db, 'flights', data.flightId);
      console.log('[setAdd - Firebase] Referencia flight creada:', result.flight.path);
    } else {
      console.warn('[setAdd - Firebase] ❌ flightId no proporcionado');
    }

    if (data.userAppId) {
      result.user_app = doc(this.db, 'user-apps', data.userAppId);
      console.log('[setAdd - Firebase] Referencia user_app creada:', result.user_app.path);
    } else {
      console.warn('[setAdd - Firebase] ❌ userAppId no proporcionado');
    }

    return result;
  }

  /**
   * Convierte datos parciales de `Booking` a `FirebaseBooking` para operaciones de actualización.
   *
   * @param data Objeto parcial `Booking`
   * @returns Objeto `FirebaseBooking` con referencias actualizadas
   */
  setUpdate(data: Partial<Booking>): FirebaseBooking {
      const result: any = {};

      if (data.bookingState !== undefined) {
          result.bookingState = sanitizeBookingState(data.bookingState);
      }

      if (data.flightId) {
          result.flight = doc(this.db, 'flights', data.flightId);
      }

      if (data.userAppId) {
          result.user_app = doc(this.db, 'user_app', data.userAppId);
      }

      return result;
  }
}
