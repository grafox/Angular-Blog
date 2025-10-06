import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { Post, Author, Category, Tag } from '../models/post.model';
import { Comment } from '../models/comment.model';
import { FirebaseService } from './firebase.service';
import { ref, onValue, set, push, remove, update, get } from 'firebase/database';
import { SEED_AUTHORS, SEED_CATEGORIES, SEED_TAGS, SEED_POSTS, SEED_COMMENTS, SEED_SITE_SETTINGS } from '../data/seed-data';

interface SiteSettings {
  blogName: string;
  title: string;
  subtitle: string;
  heroImageUrl: string;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  private firebase = inject(FirebaseService);

  private readonly posts = signal<Post[]>([]);
  private readonly authors = signal<Author[]>([]);
  private readonly categories = signal<Category[]>([]);
  private readonly tags = signal<Tag[]>([]);
  private readonly comments = signal<Comment[]>([]);
  private readonly siteSettings = signal<SiteSettings>({
    blogName: 'Angular Blog',
    title: 'From the Blog',
    subtitle: 'Latest articles and tutorials on modern web development.',
    heroImageUrl: 'https://picsum.photos/seed/blog-hero/1600/900',
  });

  readonly postCount = computed(() => this.posts().length);
  readonly commentCount = computed(() => this.comments().length);

  constructor() {
    this.seedDatabaseIfEmpty().then(() => {
      this.loadData();
    });
  }

  private async seedDatabaseIfEmpty() {
    const checkAndSeed = async (path: string, data: any) => {
        const dataRef = ref(this.firebase.db, path);
        const snapshot = await get(dataRef);
        if (!snapshot.exists()) {
            console.log(`No data at ${path}. Seeding...`);
            await set(dataRef, data);
        }
    };

    await Promise.all([
      checkAndSeed('authors', SEED_AUTHORS),
      checkAndSeed('categories', SEED_CATEGORIES),
      checkAndSeed('tags', SEED_TAGS),
      checkAndSeed('posts', SEED_POSTS),
      checkAndSeed('comments', SEED_COMMENTS),
      checkAndSeed('siteSettings', SEED_SITE_SETTINGS)
    ]);
  }

  private firebaseObjectToArray(obj: any): any[] {
    if (!obj) return [];
    return Object.keys(obj).map(key => ({ ...obj[key], id: key }));
  }

  private loadData() {
    // Posts
    onValue(ref(this.firebase.db, 'posts'), (snapshot) => {
      const postsObj = snapshot.val();
      const postsArray = this.firebaseObjectToArray(postsObj);
      postsArray.forEach(p => {
        p.createdAt = new Date(p.createdAt);
        p.updatedAt = new Date(p.updatedAt);
        if (p.categories && !Array.isArray(p.categories)) {
          p.categories = Object.values(p.categories);
        }
        if (p.tags && !Array.isArray(p.tags)) {
          p.tags = Object.values(p.tags);
        }
      });
      this.posts.set(postsArray.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    });

    // Authors
    onValue(ref(this.firebase.db, 'authors'), (snapshot) => {
      this.authors.set(this.firebaseObjectToArray(snapshot.val()));
    });

    // Categories
    onValue(ref(this.firebase.db, 'categories'), (snapshot) => {
      this.categories.set(this.firebaseObjectToArray(snapshot.val()));
    });

    // Tags
    onValue(ref(this.firebase.db, 'tags'), (snapshot) => {
      this.tags.set(this.firebaseObjectToArray(snapshot.val()));
    });

    // Comments
    onValue(ref(this.firebase.db, 'comments'), (snapshot) => {
      const commentsArray = this.firebaseObjectToArray(snapshot.val());
      commentsArray.forEach(c => {
        c.createdAt = new Date(c.createdAt);
      });
      this.comments.set(commentsArray);
    });
    
    // Site Settings
    onValue(ref(this.firebase.db, 'siteSettings'), (snapshot) => {
      if(snapshot.exists()) {
        this.siteSettings.set(snapshot.val());
      }
    });
  }

  getSiteSettings() {
    return this.siteSettings.asReadonly();
  }

  updateSiteSettings(newSettings: SiteSettings) {
    set(ref(this.firebase.db, 'siteSettings'), newSettings);
  }

  getPosts() {
    return this.posts.asReadonly();
  }
  
  getAuthors() {
    return this.authors.asReadonly();
  }

  getCategories() {
    return this.categories.asReadonly();
  }
  
  getComments() {
    return this.comments.asReadonly();
  }

  updateCommentStatus(commentId: string, status: 'approved' | 'pending' | 'rejected') {
    const commentRef = ref(this.firebase.db, `comments/${commentId}`);
    update(commentRef, { status });
  }

  deleteComment(commentId: string) {
    remove(ref(this.firebase.db, `comments/${commentId}`));
  }

  getPostById(id: string): Observable<Post | undefined> {
    return toObservable(this.posts).pipe(
        map(posts => posts.find(p => p.id === id))
    );
  }

  getPostBySlug(slug: string): Observable<Post | undefined> {
     return toObservable(this.posts).pipe(
        map(posts => posts.find(p => p.slug === slug))
    );
  }
  
  private createSlug(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }

  addPost(postData: Omit<Post, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) {
    const postListRef = ref(this.firebase.db, 'posts');
    const newPostRef = push(postListRef);
    const newPost = {
      ...postData,
      slug: this.createSlug(postData.title),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set(newPostRef, newPost);
  }

  updatePost(updatedPost: Post) {
    const postRef = ref(this.firebase.db, `posts/${updatedPost.id}`);
    const postData = {
      ...updatedPost,
      slug: this.createSlug(updatedPost.title),
      createdAt: (updatedPost.createdAt instanceof Date) 
        ? updatedPost.createdAt.toISOString() 
        : updatedPost.createdAt,
      updatedAt: new Date().toISOString(),
    };
    delete (postData as any).id;
    set(postRef, postData);
  }
  
  deletePost(postId: string) {
    remove(ref(this.firebase.db, `posts/${postId}`));
  }

  searchPosts(query: string): Observable<Post[]> {
    const lowerCaseQuery = query.toLowerCase().trim();
    if (!lowerCaseQuery) {
        return toObservable(this.posts).pipe(map(() => []));
    }
    
    return toObservable(this.posts).pipe(
        map(posts => posts.filter(post => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            const postContent = tempDiv.textContent || tempDiv.innerText || "";

            return post.title.toLowerCase().includes(lowerCaseQuery) ||
                   postContent.toLowerCase().includes(lowerCaseQuery);
        }))
    );
  }
}
