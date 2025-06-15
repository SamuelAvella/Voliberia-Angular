/**
 * Página de inicio de la aplicación.
 * Muestra información del usuario actual al cargar.
 */
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
  /** Usuario actual cargado desde la base de datos */
  currentUser?: UserApp;

  /** Indica si los datos se están cargando */
  loading = true;

  constructor(
    private authService: BaseAuthenticationService,
    private usersService: UsersAppService
  ) {}

  /**
   * Al inicializar, carga el usuario autenticado y su perfil extendido.
   */
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

