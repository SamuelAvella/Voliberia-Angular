import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  template: `
    <ion-content class="ion-padding">
      <div class="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <ion-icon name="lock-closed" class="text-8xl text-red-500 mb-4"></ion-icon>
        <h1 class="text-3xl font-bold mb-4">{{ 'ACCESS_DENIED.TITLE' | translate }}</h1>
        <p class="text-lg mb-6">{{ 'ACCESS_DENIED.MESSAGE' | translate }}</p>
        <div class="flex gap-4">
          <ion-button (click)="goHome()" color="primary">
            <ion-icon name="home" slot="start"></ion-icon>
            {{ 'COMMON.GO_HOME' | translate }}
          </ion-button>
          <ion-button (click)="goBack()" color="medium">
            <ion-icon name="arrow-back" slot="start"></ion-icon>
            {{ 'COMMON.GO_BACK' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, TranslateModule]
})
export class AccessDeniedPage {
  constructor(
    private location: Location,
    private router: Router
  ) {}

  goBack() {
    // Get the previous URL from history
    const previousUrl = document.referrer;
    
    // Check if the previous URL contains any of the restricted paths
    const restrictedPaths = ['/flights', '/bookings', '/book'];
    const isRestrictedPath = restrictedPaths.some(path => previousUrl.includes(path));

    if (isRestrictedPath) {
      this.goHome(); // If coming from a restricted path, go home instead
    } else {
      this.location.back(); // Otherwise, go back
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }
} 