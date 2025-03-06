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
  
    // 1. Arrival date must be later than departure Date
    if (arrivalDate <= departureDate) {
      return { arrivalDateInvalid: true };
    }
  
    // 2. If both dates are the same day, they must have 40 min between them
    const departureMinutes = departureDate.getHours() * 60 + departureDate.getMinutes();
    const arrivalMinutes = arrivalDate.getHours() * 60 + arrivalDate.getMinutes();
    const minutesDifference = arrivalMinutes - departureMinutes;

    if (minutesDifference < 40 && arrivalDate.getDate() === departureDate.getDate()) {
    return { arrivalDateTooClose: true };
    }

    // If the arrivalDate is the next day, we adjust the different and add 1440 minutes (24h)
    if (arrivalDate.getDate() !== departureDate.getDate() && (minutesDifference + 1440) < 40) {
    return { arrivalDateTooClose: true };
    }
  
    return null;  // Return null (whithout errors), if all validation has been checked
};