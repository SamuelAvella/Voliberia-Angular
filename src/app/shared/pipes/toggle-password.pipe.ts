/**
 * Pipe que cambia entre tipos de input 'text' y 'password'
 * según si la contraseña debe ser visible.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'togglePassword',
  pure: true,
})
export class TogglePasswordPipe implements PipeTransform {
  /**
   * Retorna 'text' si es visible, 'password' si no lo es.
   * @param isVisible Booleano que indica si debe ser visible
   * @returns Tipo de input a mostrar
   */
  transform(isVisible: boolean): string {
    return isVisible ? 'text' : 'password';
  }
}
