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
  users: UserApp[] = [];
  filteredUsers: UserApp[] = [];
  filteredAdmins: UserApp[] = [];
  loading = true;
  searchTerm = '';
  currentUserApp?: UserApp;

  constructor(
    private usersService: UsersAppService,
    private authService: BaseAuthenticationService,
    private modalCtrl: ModalController
  ) {}

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

  filterUsers() {
    let filtered = this.users;
    
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

  isCurrentUser(user: UserApp): boolean {
    return this.currentUserApp?.id === user.id;
  }

  async updateUserRole(user: UserApp, event: any) {
    const newRole = event.detail.value;
    if (user.role === newRole || this.isCurrentUser(user)) return;

    const modal = await this.modalCtrl.create({
      component: ConfirmRoleModalComponent,
      componentProps: {
        user,
        newRole
      },
      cssClass: 'small-modal'
    });

    await modal.present();
    const { data: confirmed } = await modal.onDidDismiss();

    if (confirmed) {
      this.usersService.update(user.id, { ...user, role: newRole }).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === user.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
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
