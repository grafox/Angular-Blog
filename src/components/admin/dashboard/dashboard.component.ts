import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private blogService = inject(BlogService);
  
  currentUser = this.authService.currentUser;
  postCount = this.blogService.postCount;
  userCount = this.authService.userCount;
  commentCount = this.blogService.commentCount;
}