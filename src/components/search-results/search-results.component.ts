import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
// FIX: Corrected the import path for BlogService.
import { BlogService } from '../../services/blog.service';
// FIX: Corrected the import path for Post model.
import { Post } from '../../models/post.model';
import { switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultsComponent {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  
  query = signal('');
  results$: Observable<Post[]>;

  constructor() {
    this.results$ = this.route.queryParamMap.pipe(
      tap(params => this.query.set(params.get('q') || '')),
      switchMap(params => {
        const q = params.get('q');
        return this.blogService.searchPosts(q || '');
      })
    );
  }

  getExcerpt(content: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.substring(0, 150) + '...';
  }
}
