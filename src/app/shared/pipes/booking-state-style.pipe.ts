import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bookingStateStyle',
})
export class BookingStateStylePipe implements PipeTransform {

  /*transform(state: 'inactive' | 'active' | 'cancelled') {
    switch (state) {
      case 'inactive':
        return {
          bg: 'bg-white',
          text: 'text-yellow-600',
          label: 'Pendiente',
          opacity: '',
        };
      case 'active':
        return {
          bg: 'bg-blue-50',
          text: 'text-green-600',
          label: 'Confirmado',
          opacity: '',
        };
      case 'cancelled':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-500',
          label: 'Cancelado',
          opacity: 'opacity-50',
        };
      default:
        return {
          bg: 'bg-white',
          text: 'text-gray-600',
          label: 'Desconocido',
          opacity: '',
        };
    }
  }*/

  transform(){
    if (true) {
      return {
          bg: 'bg-white',
          text: 'text-yellow-600',
          label: 'Pendiente',
          opacity: '',
        };
    } else if (false) {
      return {
          bg: 'bg-gray-100',
          text: 'text-gray-500',
          label: 'Cancelado',
          opacity: 'opacity-50',
        };
    }
  }

}
