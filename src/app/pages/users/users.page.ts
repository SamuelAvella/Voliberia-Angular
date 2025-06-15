/**
 * Página de administración de usuarios.
 * Permite listar, buscar y actualizar el rol de los usuarios.
 */
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsersAppService } from '../../core/services/impl/usersApp.service';
import { UserApp } from '../../core/models/userApp.model';
import { Paginated } from '../../core/models/paginated.model';
import { BaseAuthenticationService } from '../../core/services/impl/base-authentication.service';
import { firstValueFrom } from 'rxjs';
import { ConfirmRoleModalComponent } from '../../shared/components/confirm-role-modal/confirm-role-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  /** Lista completa de usuarios */
  users: UserApp[] = [];

  /** Lista de usuarios con rol 'user' */
  filteredUsers: UserApp[] = [];

  /** Lista de usuarios con rol 'admin' */
  filteredAdmins: UserApp[] = [];

  /** Indica si los datos están cargando */
  loading = true;

  /** Término de búsqueda actual */
  searchTerm = '';

  /** Usuario actual autenticado */
  currentUserApp?: UserApp;

  constructor(
    private usersService: UsersAppService,
    private authService: BaseAuthenticationService,
    private modalCtrl: ModalController
  ) {}

  /**
   * Inicializa la página y carga los usuarios.
   */
  async ngOnInit() {
    try {
      const currentUser = await this.authService.getCurrentUser();
      if (currentUser) {
        const userApp = await firstValueFrom(this.usersService.getByUserId(currentUser.id));
        this.currentUserApp = userApp || undefined;
      }
      this.loadUsers();
    } catch (error) {
      console.error('Error getting current user:', error);
      this.loadUsers();
    }
  }

  /**
   * Carga todos los usuarios desde el servicio.
   */
  loadUsers() {
    this.loading = true;
    this.usersService.getAll().subscribe({
      next: (response: UserApp[] | Paginated<UserApp>) => {
        this.users = Array.isArray(response) ? response : response.data;
        this.filterUsers();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Filtra usuarios por rol y término de búsqueda.
   */
  filterUsers() {
    let filtered = [...this.users];

    if (this.searchTerm.trim()) {
      const searchTerm = this.searchTerm.toLowerCase();
      filtered = this.users.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.surname.toLowerCase().includes(searchTerm) ||
        user.id.toLowerCase().includes(searchTerm)
      );
    }

    this.filteredAdmins = filtered.filter(user => user.role === 'admin');
    this.filteredUsers = filtered.filter(user => user.role === 'user');
  }

  /**
   * Verifica si el usuario mostrado es el mismo que el actual.
   * @param user Usuario a comparar
   */
  isCurrentUser(user: UserApp): boolean {
    return this.currentUserApp?.id === user.id;
  }

  /**
   * Actualiza el rol de un usuario después de confirmación.
   * @param user Usuario a actualizar
   * @param event Evento con el nuevo rol seleccionado
   */
  async updateUserRole(user: UserApp, event: any) {
    const newRole = event.detail.value;
    if (user.role === newRole || this.isCurrentUser(user)) return;

    const modal = await this.modalCtrl.create({
      component: ConfirmRoleModalComponent,
      cssClass: 'custom-tailwind-modal',
      showBackdrop: true,
      backdropDismiss: true,
      componentProps: { user, newRole },
    });

    await modal.present();
    const { data: confirmed } = await modal.onDidDismiss();

    if (confirmed) {
      this.usersService.update(user.id, { role: newRole }).subscribe({
        next: () => {
          const index = this.users.findIndex(u => u.id === user.id);
          if (index !== -1) {
            this.users[index] = { ...this.users[index], role: newRole };
            this.filterUsers();
          }
        },
        error: (error) => {
          console.error('Error updating user role:', error);
          event.target.value = user.role;
        }
      });
    } else {
      event.target.value = user.role;
    }
  }
}

