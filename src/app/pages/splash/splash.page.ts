/**
 * Pantalla de carga inicial (Splash).
 * Muestra animación de bienvenida y redirige al login tras unos segundos.
 */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { timer } from 'rxjs';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonicModule, LottieComponent]
})
export class SplashPage implements OnInit {

  /** Configuración de la animación Lottie */
  options: AnimationOptions = {
    path: '/assets/lotties/splash.json',
  };

  constructor(private router: Router) {}

  /**
   * Redirige automáticamente al login tras 5 segundos.
   */
  ngOnInit() {
    timer(5000).subscribe(_ => {
      this.router.navigate(['/login']);
    });
  }

  /**
   * Se ejecuta cuando la animación Lottie es creada.
   * @param animationItem Instancia de la animación
   */
  onAnimationCreated(animationItem: AnimationItem): void {
    console.log('Animación creada:', animationItem);
  }
}

