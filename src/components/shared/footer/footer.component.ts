import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  // FIX: Added imports array to make this a standalone component, as required by its usage.
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  currentYear = signal(new Date().getFullYear());
}
