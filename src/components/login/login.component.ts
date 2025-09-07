import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private blogService = inject(BlogService);

  loading = signal(false);
  error = signal<string | null>(null);
  UserRole = UserRole; // Expose enum to template
  siteSettings = this.blogService.getSiteSettings();

  onLogin(role: UserRole) {
    this.loading.set(true);
    this.error.set(null);
    this.authService.login(role).subscribe({
      next: (user) => {
        if (user) {
          this.router.navigate(['/admin']);
        } else {
          this.error.set('Login failed. Please try again.');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('An unexpected error occurred.');
        this.loading.set(false);
      }
    });
  }
}
