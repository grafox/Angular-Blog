import { Component, ChangeDetectionStrategy, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
// FIX: Corrected the import path for BlogService.
import { BlogService } from '../../services/blog.service';
// FIX: Corrected the import path for Post model.
import { Post } from '../../models/post.model';
import { switchMap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogPostComponent {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private sanitizer = inject(DomSanitizer);
  private titleService = inject(Title);

  // FIX: Refactored to use modern Angular signals with `toSignal` to avoid manual subscriptions and potential memory leaks.
  private readonly post$ = this.route.paramMap.pipe(
    switchMap(params => {
      const slug = params.get('slug');
      if (!slug) {
        return of(undefined);
      }
      return this.blogService.getPostBySlug(slug);
    })
  );

  readonly post = toSignal(this.post$);

  readonly sanitizedContent = computed<SafeHtml | ''>(() => {
    const content = this.post()?.content;
    if (content) {
      return this.sanitizer.bypassSecurityTrustHtml(content);
    }
    return '';
  });

  constructor() {
    effect(() => {
      const currentPost = this.post();
      if (currentPost) {
        this.titleService.setTitle(`${currentPost.title} | Angular CMS Blog`);
      }
    });
  }
}
