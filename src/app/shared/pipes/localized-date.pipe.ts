import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localizedDate'
})
export class LocalizedDatePipe implements PipeTransform {
  transform(value: Date | string, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions): string {
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
