import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models/user.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  users = this.authService.getUsers();
  currentUser = this.authService.currentUser;
  
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
  
  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.authService.deleteUser(userId);
    }
  }
}