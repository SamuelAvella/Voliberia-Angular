import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localizedCurrency',
})
export class LocalizedCurrencyPipe implements PipeTransform {
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
