import { AbstractControl, FormControl, ValidationErrors } from "@angular/forms";

export const dateNotInThePast = (control: FormControl): ValidationErrors | null => {
    const today = new Date();
    const departureDate = new Date(control.value);
  
    // Compare departure date with actual date, return null if they're the same or it's earlier
    if (departureDate <= today) {
      return { dateNotInThePast: true };
    }
  
    return null;
};

export const arrivalDateValidator = (group: AbstractControl): ValidationErrors | null => {
    const departureDateControl = group.get('departureDate');
    const arrivalDateControl = group.get('arrivalDate');
  
    if (!departureDateControl || !arrivalDateControl) {
      return null;  // If there is no controls, we don't make any validation
    }
  
    const departureDate = new Date(departureDateControl.value);
    const arrivalDate = new Date(arrivalDateControl.value);
  
    // 1. La fecha de llegada debe ser posterior a la de salida
    if (arrivalDate <= departureDate) {
      return { arrivalDateInvalid: true };
    }
  
    // 2. Si la fecha de llegada es el mismo día, debe ser al menos 40 minutos después de la salida
    if (arrivalDate.toDateString() === departureDate.toDateString()) {
      const minArrivalDate = new Date(departureDate.getTime() + 40 * 60 * 1000);
      if (arrivalDate < minArrivalDate) {
        return { arrivalDateTooClose: true };
      }
    }
  
    return null;  // Si pasa todas las validaciones, devuelve null (sin errores)
};