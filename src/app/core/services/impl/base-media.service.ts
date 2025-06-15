
/**
 * Servicio base abstracto para subir archivos multimedia.
 * @template T Tipo del identificador del archivo subido.
*/
import { Observable } from "rxjs";

export abstract class BaseMediaService<T = number> {
  /**
   * Sube un archivo en formato Blob.
   * @param blob Archivo a subir.
   * @returns Observable con una lista de identificadores o URLs.
   */
  abstract upload(blob: Blob): Observable<T[]>;
}
