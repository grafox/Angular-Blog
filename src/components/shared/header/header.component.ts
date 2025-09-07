import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;

  onSearch(query: string, searchInput: HTMLInputElement) {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      this.router.navigate(['/search'], { queryParams: { q: trimmedQuery } });
      searchInput.value = '';
    }
  }
}
