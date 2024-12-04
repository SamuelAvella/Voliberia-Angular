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
  standalone:true, //Al crearlo standalone, no necesita splash.module.ts y lo dejamos por si acaso
  imports: [IonicModule, LottieComponent]
})
export class SplashPage implements OnInit {

  options: AnimationOptions = {
    path: '/assets/lotties/splash.json',
  };


  onAnimationCreated(animationItem: AnimationItem): void {
    console.log('Animación creada:', animationItem);
  }

  constructor(
    private router:Router
  ) { }

  ngOnInit() {
    timer(5000).subscribe(_=>{
      this.router.navigate(['/home']);
    });
  }

}
