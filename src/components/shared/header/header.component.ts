import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);

  isMobileMenuOpen = signal(false);
  currentUser = this.authService.currentUser;
  currentTheme = this.themeService.currentTheme;
  
  toggleMobileMenu() {
    this.isMobileMenuOpen.update(value => !value);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  onSearch(query: string, searchInput: HTMLInputElement) {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      this.isMobileMenuOpen.set(false); // Close menu on search
      this.router.navigate(['/search'], { queryParams: { q: trimmedQuery } });
      searchInput.value = '';
    }
  }
}