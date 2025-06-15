/**
 * Pipe para formatear fechas localizadas.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localizedDate'
})
export class LocalizedDatePipe implements PipeTransform {
  /**
   * Transforma una fecha en formato localizado.
   * @param value Fecha como objeto Date o string
   * @param locale Localización (por defecto 'en-US')
   * @param options Opciones adicionales de formato
   * @returns Fecha como string formateado
   */
  transform(value: Date | string | undefined, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions): string {
    if (!value) return '';
    const date = new Date(value);

    const defaultOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };

    return date.toLocaleDateString(locale, { ...defaultOptions, ...options });
  }
}
