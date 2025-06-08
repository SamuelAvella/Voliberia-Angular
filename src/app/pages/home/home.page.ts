import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { BaseAuthenticationService } from '../../core/services/impl/base-authentication.service';
import { UsersAppService } from '../../core/services/impl/usersApp.service';
import { UserApp } from '../../core/models/userApp.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  currentUser?: UserApp;
  loading = true;

  constructor(
    private authService: BaseAuthenticationService,
    private usersService: UsersAppService
  ) {}

  async ngOnInit() {
    try {
      const user = await this.authService.getCurrentUser();
      if (user) {
        const userApp = await firstValueFrom(this.usersService.getByUserId(user.id));
        this.currentUser = userApp || undefined;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    } finally {
      this.loading = false;
    }
  }
}
