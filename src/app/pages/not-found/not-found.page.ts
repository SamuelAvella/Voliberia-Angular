/**
 * Página de error 404 - No encontrada.
 * Muestra mensaje de página no existente y permite volver atrás.
 */
import { Component } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.html'
})
export class NotFoundPage {
  constructor(private location: Location) {}

  /**
   * Redirige a la página anterior en el historial.
   */
  goBack() {
    this.location.back();
  }
}

