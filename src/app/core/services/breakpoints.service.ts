/**
 * Servicio que detecta el tamaño de pantalla actual usando `BreakpointObserver` de Angular CDK.
 * Se utiliza para adaptar la interfaz a dispositivos móviles o de escritorio.
 */
import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BreakpointsService {
  /**
   * Observable que indica si el dispositivo actual es un "handset" (dispositivo móvil).
   * Se actualiza automáticamente en función del tamaño de la pantalla.
   */
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    /**
   * Constructor que inyecta el `BreakpointObserver`.
   * @param breakpointObserver Servicio de Angular CDK para observar puntos de corte (breakpoints)
   */
  constructor(private breakpointObserver: BreakpointObserver) {}
}
