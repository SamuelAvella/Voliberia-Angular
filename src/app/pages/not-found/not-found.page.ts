import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  template: `

    <ion-header [translucent]="true">
      <ion-toolbar color="primary" class="h-[45px] sm:h-[64px] px-4">
        <div class="flex items-center h-full space-x-3">
          <img src="assets/img/logo.png" alt="Logo" class="h-6 sm:h-8 w-auto" />

          <div class="text-white leading-tight">
            <div class="font-istokWeb font-bold text-sm sm:text-base">VOLIBERIA</div>
            <div class="font-inter text-xs sm:text-sm opacity-80 -mt-1 hidden sm:block">
              {{ 'HEADER.TITLE' | translate}}
            </div>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div class="text-9xl font-bold text-gray-300 mb-4">404</div>
        <ion-icon name="search" class="text-7xl text-gray-400 mb-4"></ion-icon>
        <h1 class="text-3xl font-bold mb-4">{{ 'NOT_FOUND.TITLE' | translate }}</h1>
        <p class="text-lg mb-6">{{ 'NOT_FOUND.MESSAGE' | translate }}</p>
        <ion-button (click)="goBack()" color="primary">
          <ion-icon name="arrow-back" slot="start"></ion-icon>
          {{ 'COMMON.GO_BACK' | translate }}
        </ion-button>
      </div>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, TranslateModule]
})
export class NotFoundPage {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
