import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador personalizado que asegura que la llegada ocurra al menos 30 minutos
 * después de la salida.
 * @returns Error 'arrivalTooSoon' si la llegada es muy pronto, o null si es válido.
 */
export const arrivalDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const departure = control.get('departureDate')?.value;
  const arrival = control.get('arrivalDate')?.value;

  
  if (!departure || !arrival) {
    return null;
  }

  const departureDate = new Date(departure);
  const arrivalDate = new Date(arrival);

  const diffInMinutes = (arrivalDate.getTime() - departureDate.getTime()) / 60000;

  console.log('Validating dates:', departureDate, arrivalDate, diffInMinutes);

  if (diffInMinutes < 30) {
    return { arrivalTooSoon: true };
  }

  return null;
};
