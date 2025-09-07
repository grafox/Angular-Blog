import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-post-management',
  templateUrl: './post-management.component.html',
  imports: [CommonModule, RouterModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostManagementComponent {
  private blogService = inject(BlogService);
  private router = inject(Router);

  posts = this.blogService.getPosts();

  createPost() {
    this.router.navigate(['/admin/posts/new']);
  }

  editPost(postId: string) {
    this.router.navigate(['/admin/posts/edit', postId]);
  }

  deletePost(postId: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.blogService.deletePost(postId);
    }
  }
}