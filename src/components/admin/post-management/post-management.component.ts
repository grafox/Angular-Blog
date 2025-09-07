import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-post-management',
  templateUrl: './post-management.component.html',
  imports: [CommonModule, RouterModule, DatePipe, ConfirmationDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostManagementComponent {
  private blogService = inject(BlogService);
  private router = inject(Router);

  posts = this.blogService.getPosts();

  isDeleteModalOpen = signal(false);
  postToDeleteId = signal<string | null>(null);

  createPost() {
    this.router.navigate(['/admin/posts/new']);
  }

  editPost(postId: string) {
    this.router.navigate(['/admin/posts/edit', postId]);
  }

  promptDeletePost(postId: string) {
    this.postToDeleteId.set(postId);
    this.isDeleteModalOpen.set(true);
  }

  confirmDelete() {
    const postId = this.postToDeleteId();
    if (postId) {
      this.blogService.deletePost(postId);
    }
    this.closeDeleteModal();
  }

  closeDeleteModal() {
    this.isDeleteModalOpen.set(false);
    this.postToDeleteId.set(null);
  }
}
