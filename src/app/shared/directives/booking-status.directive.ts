import { Directive, ElementRef, Input, Renderer2, OnChanges } from '@angular/core';

@Directive({
  selector: '[appBookingState]',
})
export class BookingStatusDirective implements OnChanges {
  @Input('appBookingState') status!: boolean; // Recibe el estado de la reserva

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    this.updateAppearance(); // Llamar cada vez que cambie el estado
  }

  private updateAppearance(): void {
    // Limpia el contenido inicial
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', '');

    const icon = this.renderer.createElement('ion-icon');
    const color = this.status ? 'green' : 'red';
    const iconName = this.status ? 'checkmark-circle' : 'close-circle';

    this.renderer.setAttribute(icon, 'name', iconName);
    this.renderer.setStyle(icon, 'color', color);
    this.renderer.setStyle(icon, 'margin-left', '8px'); // Espacio entre texto e ícono

    this.renderer.appendChild(this.el.nativeElement, icon);
  }
}
