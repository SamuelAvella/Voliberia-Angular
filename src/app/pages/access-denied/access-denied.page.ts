import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.html'
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
