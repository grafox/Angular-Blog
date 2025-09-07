import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideNavComponent } from '../side-nav/side-nav.component';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  imports: [RouterModule, SideNavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {}
