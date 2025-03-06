import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'togglePassword',
  pure: true,
})
export class TogglePasswordPipe implements PipeTransform {
  transform(isVisible: boolean): string {
    return isVisible ? 'text' : 'password';
  }
}
