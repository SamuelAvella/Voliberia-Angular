import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from './core/services/translation.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Flights', url: '/flights', icon: 'airplane' },
    { title: 'Bookings', url: '/bookings', icon: 'book' },
    { title: 'Users', url: '/user-app', icon: 'people' },
  ];
  
  constructor(
    private translationService : TranslationService,
    private router:Router
  ) {}

}
