import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// FIX: Corrected the import path for BlogService.
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogListComponent {
  private blogService = inject(BlogService);
  posts = this.blogService.getPosts();
  siteSettings = this.blogService.getSiteSettings();

  getExcerpt(content: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.substring(0, 150) + '...';
  }
}
