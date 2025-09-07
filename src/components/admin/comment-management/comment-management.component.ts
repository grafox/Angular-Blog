import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { Comment } from '../../../models/comment.model';

@Component({
  selector: 'app-comment-management',
  templateUrl: './comment-management.component.html',
  imports: [CommonModule, RouterModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentManagementComponent {
  private blogService = inject(BlogService);
  
  comments = this.blogService.getComments();
  private posts = this.blogService.getPosts();
  
  private postMap = computed(() => 
    new Map(this.posts().map(post => [post.id, post.title]))
  );

  statuses: Comment['status'][] = ['approved', 'pending', 'rejected'];

  getPostTitle(postId: string): string {
    return this.postMap().get(postId) || 'Unknown Post';
  }

  updateStatus(commentId: string, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value as 'approved' | 'pending' | 'rejected';
    this.blogService.updateCommentStatus(commentId, newStatus);
  }

  deleteComment(commentId: string) {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.blogService.deleteComment(commentId);
    }
  }
}
