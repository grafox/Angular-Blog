import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models/user.model';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  imports: [CommonModule, RouterModule, ConfirmationDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  users = this.authService.getUsers();
  currentUser = this.authService.currentUser;
  
  isDeleteModalOpen = signal(false);
  userToDeleteId = signal<string | null>(null);

  // Expose UserRole enum to the template
  userRoles = Object.values(UserRole).filter(role => role !== UserRole.Visitor);

  isCurrentUser(userId: string): boolean {
    return this.currentUser()?.id === userId;
  }

  createUser() {
    this.router.navigate(['/admin/users/new']);
  }

  editUser(userId: string) {
    this.router.navigate(['/admin/users/edit', userId]);
  }
  
  updateRole(userId: string, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newRole = selectElement.value as UserRole;
    this.authService.updateUserRole(userId, newRole);
  }
  
  promptDeleteUser(userId: string) {
    this.userToDeleteId.set(userId);
    this.isDeleteModalOpen.set(true);
  }

  confirmDelete() {
    const userId = this.userToDeleteId();
    if (userId) {
      this.authService.deleteUser(userId);
    }
    this.closeDeleteModal();
  }

  closeDeleteModal() {
    this.isDeleteModalOpen.set(false);
    this.userToDeleteId.set(null);
  }
}
