import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  template: `
    @if (showPublicLayout()) {
      <div class="flex flex-col min-h-screen">
        <app-header></app-header>
        <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <router-outlet></router-outlet>
        </main>
        <app-footer></app-footer>
      </div>
    } @else {
      <router-outlet></router-outlet>
    }
  `,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private router = inject(Router);
  private themeService = inject(ThemeService);

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects)
    ), { initialValue: this.router.url }
  );

  showPublicLayout = computed(() => {
    const url = this.currentUrl();
    return !url.startsWith('/admin') && !url.startsWith('/login');
  });
}