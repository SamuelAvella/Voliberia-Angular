import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  template: `
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