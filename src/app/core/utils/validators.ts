import { AbstractControl, ValidationErrors } from "@angular/forms";

// Validación de fortaleza de contraseña
export function passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
        return null;
    }

    // Regex para al menos 10 caracteres, una mayúscula, un número y un carácter especial
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[\w!@#$%^&*()\-_=+{};:,<.>]{10,}$/;
    const isValid = passwordRegex.test(value);

    return isValid ? null : { passwordStrength: 'La contraseña debe tener al menos 10 caracteres, una mayúscula, un número y un carácter especial.' };
}


// Validación de coincidencia de contraseñas
export function matchPasswordsValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;

    const confirmPassword = group.get('confirmPassword')?.value;

    if (!confirmPassword) {
        return null;
    }
    return password === confirmPassword ? null : { passwordsMismatch: 'Las contraseñas no coinciden.' };
  }
