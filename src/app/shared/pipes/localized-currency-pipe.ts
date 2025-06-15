/**
 * Pipe para mostrar un número como moneda, localizando según idioma y tipo de divisa.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localizedCurrency',
})
export class LocalizedCurrencyPipe implements PipeTransform {
  /**
   * Transforma un valor numérico a formato de moneda.
   * @param value Valor numérico a formatear
   * @param locale Localización (por defecto 'en-US')
   * @param currency Código de moneda (opcional)
   * @returns String con el valor formateado como moneda
   */
  transform(
    value: number | undefined,
    locale: string = 'en-US',
    currency?: string
  ): string {
    if (value == null) return '';

    // Determina la moneda en función del idioma
    const currencyCode = currency || (locale.startsWith('es') ? 'EUR' : 'USD');

    // Formateo de moneda
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
}
