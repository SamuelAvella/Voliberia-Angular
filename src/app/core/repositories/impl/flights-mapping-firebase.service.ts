import { Inject, Injectable } from "@angular/core";
import { Flight } from "../../models/flight.model";
import { IBaseMapping } from "../interfaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Firestore, getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG_TOKEN } from "../repository.token";
import { initializeApp } from "firebase/app";
import { FirebaseFlight } from "../../models/firebase/firebase-flight.model";

/**
 * Servicio de mapeo para convertir datos de Firebase a modelos `Flight` y viceversa.
 * Implementa la interfaz `IBaseMapping<Flight>` para adaptar los datos en todas las operaciones del repositorio.
 */
@Injectable({
    providedIn: 'root'
})
export class FlightsMappingFirebaseService implements IBaseMapping<Flight>{

  private db: Firestore;

  /**
   * Constructor que inicializa la instancia de Firestore con la configuración de Firebase.
   *
   * @param firebaseConfig Configuración inyectada de Firebase
   */
  constructor(@Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig: any){
      this.db = getFirestore(initializeApp(firebaseConfig))
  }

  /**
   * Convierte un documento de Firebase a un modelo `Flight`.
   *
   * @param data Documento con ID y datos de Firebase
   * @returns Modelo `Flight`
   */
  getOne(data: {id: string} & FirebaseFlight): Flight {
      return{
          id: data.id,
          origin: data.origin,
          destination: data.destination,
          departureDate: data.departureDate,
          arrivalDate: data.arrivalDate,
          seatPrice: data.seatPrice,
      };
  }

  /**
   * Devuelve los datos paginados del tipo `Flight`.
   *
   * @param page Página actual
   * @param pageSize Elementos por página
   * @param total Total de elementos encontrados
   * @param data Lista de documentos de Firebase
   * @returns Objeto `Paginated<Flight>`
   */
  getPaginated(page: number, pageSize: number, total: number, data: ({id: string} &FirebaseFlight)[]): Paginated<Flight> {
      return {
          page,
          pageSize,
          pages: Math.ceil(total / pageSize),
          data: data.map(item => this.getOne(item))
      };
  }

  /**
   * Mapea un documento recién añadido a un modelo `Flight`.
   *
   * @param data Documento de Firebase con ID
   * @returns Modelo `Flight`
   */
  getAdded(data: {id: string} & FirebaseFlight): Flight {
      return this.getOne(data)
  }

  /**
   * Mapea un documento actualizado a un modelo `Flight`.
   *
   * @param data Documento de Firebase con ID
   * @returns Modelo `Flight`
   */
  getUpdated(data: {id: string} & FirebaseFlight): Flight {
      return this.getOne(data)
  }

  /**
   * Mapea un documento eliminado a un modelo `Flight`.
   *
   * @param data Documento de Firebase con ID
   * @returns Modelo `Flight`
   */
  getDeleted(data: {id: string} & FirebaseFlight): Flight {
      return this.getOne(data)
  }

  /**
   * Transforma un modelo `Flight` para ser añadido a Firebase.
   *
   * @param data Modelo `Flight`
   * @returns Objeto `FirebaseFlight` listo para guardar
   */
  setAdd(data: Flight): FirebaseFlight {
      return {
          origin: data.origin,
          destination: data.destination,
          departureDate: data.departureDate,
          arrivalDate: data.arrivalDate,
          seatPrice: data.seatPrice,
      };
  }

  /**
   * Transforma los campos actualizados de un modelo `Flight` para su actualización en Firebase.
   *
   * @param data Datos parciales del modelo `Flight`
   * @returns Objeto `FirebaseFlight` parcial con los campos modificados
   */
  setUpdate(data: Partial<Flight>): FirebaseFlight {
      const result: any = {};

      if (data.origin) result.origin = data.origin;
      if (data.destination) result.destination = data.destination;
      if (data.departureDate) result.departureDate = data.departureDate;
      if (data.arrivalDate) result.arrivalDate = data.arrivalDate;
      if (data.seatPrice) result.seatPrice = data.seatPrice;

      return result;
  }

}
