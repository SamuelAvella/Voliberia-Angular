import { Directive, ElementRef, Input, Renderer2, OnChanges } from '@angular/core';

@Directive({
  selector: '[appBookingState]'
})
export class BookingStatusDirective implements OnChanges {
  @Input('appBookingState') status!: boolean; // Recibe el estado de la reserva

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    this.updateAppearance(); // Llamar cada vez que cambie el estado
  }

  private updateAppearance(): void {
    if (this.status) {
      // Reserva activa: Cambia a verde o muestra el ícono de tick
      this.renderer.setStyle(this.el.nativeElement, 'color', 'green');
      this.renderer.setProperty(
        this.el.nativeElement,
        'innerHTML',
        '<ion-icon name="checkmark-circle"></ion-icon> Activa'
      );
    } else {
      // Reserva inactiva: Cambia a rojo o muestra otro ícono
      this.renderer.setStyle(this.el.nativeElement, 'color', 'red');
      this.renderer.setProperty(
        this.el.nativeElement,
        'innerHTML',
        '<ion-icon name="close-circle"></ion-icon> Inactiva'
      );
    }
  }
}
