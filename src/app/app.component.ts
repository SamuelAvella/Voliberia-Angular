import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/pages/home', icon: 'home' },
    { title: 'Flights', url: '/pages/flights', icon: 'airplane' },
    { title: 'Bookings', url: '/pages/bookings', icon: 'book' },
    { title: 'Users', url: '/pages/user-app', icon: 'people' },
  ];
  
  constructor(
    private router:Router
  ) {}
}
