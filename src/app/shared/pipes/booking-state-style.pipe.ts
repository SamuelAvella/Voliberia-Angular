import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bookingStateStyle',
})
export class BookingStateStylePipe implements PipeTransform {
  transform(state: string, key: 'bg' | 'text' | 'label' | 'opacity' = 'bg'): string {
    const normalize = (value: string) => {
      if (value === 'confirm') return 'confirmed';
      return value;
    };

    const normalized = normalize(state);

    const styles: Record<string, Record<string, string>> = {
      pending: {
        bg: 'bg-white',
        text: 'text-yellow-600',
        label: 'Pendiente',
        opacity: '',
      },
      confirmed: {
        bg: 'bg-blue-50',
        text: 'text-green-600',
        label: 'Confirmado',
        opacity: '',
      },
      cancelled: {
        bg: 'bg-gray-100',
        text: 'text-gray-500',
        label: 'Cancelado',
        opacity: 'opacity-50',
      },
    };

    return styles[normalized]?.[key] || '';
  }
}
