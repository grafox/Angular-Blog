import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavComponent {
  authService = inject(AuthService);
  currentUser = this.authService.currentUser;
  UserRole = UserRole;

  logout() {
    this.authService.logout();
  }
}
