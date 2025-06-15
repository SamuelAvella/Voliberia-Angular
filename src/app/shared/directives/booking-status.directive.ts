/**
 * Directiva para mostrar un icono de estado según si la reserva está confirmada o cancelada.
 * Muestra un icono verde si está confirmada, rojo si está cancelada.
 */
import { Directive, ElementRef, Input, Renderer2, OnChanges } from '@angular/core';

@Directive({
  selector: '[appBookingState]',
})
export class BookingStatusDirective implements OnChanges {
  /**
   * Estado de la reserva (true = confirmada, false = cancelada)
   */
  @Input('appBookingState') status!: boolean;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  /** Detecta cambios en el input y actualiza la vista */
  ngOnChanges(): void {
    this.updateAppearance();
  }

  /** Actualiza el estilo del elemento según el estado */
  private updateAppearance(): void {
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', '');

    const icon = this.renderer.createElement('ion-icon');
    const color = this.status ? 'green' : 'red';
    const iconName = this.status ? 'checkmark-circle' : 'close-circle';

    this.renderer.setAttribute(icon, 'name', iconName);
    this.renderer.setStyle(icon, 'color', color);
    this.renderer.setStyle(icon, 'margin-left', '8px');

    this.renderer.appendChild(this.el.nativeElement, icon);
  }
}

