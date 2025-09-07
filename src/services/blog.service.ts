import { Injectable, signal, computed } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Post, Author, Category, Tag } from '../models/post.model';

const AUTHORS: Author[] = [
  { id: 'user-1', name: 'Alex Johnson', profileImage: 'https://i.pravatar.cc/150?u=alex', bio: 'Frontend enthusiast with a passion for clean code and beautiful UIs.' },
  { id: 'user-2', name: 'Maria Garcia', profileImage: 'https://i.pravatar.cc/150?u=maria', bio: 'Backend developer specializing in serverless architectures and Firebase.' }
];

const CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Angular', slug: 'angular' },
  { id: 'cat-2', name: 'Firebase', slug: 'firebase' },
  { id: 'cat-3', name: 'Web Development', slug: 'web-development' },
];

const TAGS: Tag[] = [
    {id: 'tag-1', name: 'Signals', slug: 'signals'},
    {id: 'tag-2', name: 'Performance', slug: 'performance'},
    {id: 'tag-3', name: 'Firestore', slug: 'firestore'},
    {id: 'tag-4', name: 'UI/UX', slug: 'ui-ux'},
];


const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'Getting Started with Angular Signals',
    slug: 'getting-started-with-angular-signals',
    content: `
      <p class="mb-4">Angular Signals are a new reactivity primitive that allows us to create reactive values and express dependencies between them. This is a game-changer for state management in Angular applications.</p>
      <h3 class="text-xl font-semibold mt-6 mb-2">Why Signals?</h3>
      <p class="mb-4">Signals provide a more fine-grained change detection mechanism compared to Zone.js. When a signal's value changes, only the components that depend on that signal are checked for updates. This leads to significant performance improvements, especially in complex applications.</p>
      <pre class="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto"><code class="language-typescript">import { signal } from '@angular/core';

const count = signal(0);

// To read the value
console.log(count()); // 0

// To update the value
count.set(1);

// To update based on the previous value
count.update(value => value + 1);
      </code></pre>
      <p class="mt-4">This new system simplifies state management and makes Angular applications faster and more efficient.</p>
    `,
    status: 'published',
    createdAt: new Date('2023-10-26T10:00:00Z'),
    updatedAt: new Date('2023-10-26T12:30:00Z'),
    author: AUTHORS[0],
    categories: [CATEGORIES[0], CATEGORIES[2]],
    tags: [TAGS[0], TAGS[1]],
    featuredImage: 'https://picsum.photos/seed/signals/800/400',
    viewsCount: 1250
  },
  {
    id: 'post-2',
    title: 'Securing Your App with Firebase Firestore Rules',
    slug: 'securing-app-with-firestore-rules',
    content: `
      <p class="mb-4">Firebase Firestore is a powerful NoSQL database, but with great power comes great responsibility. Securing your data is crucial, and Firestore provides a robust security model through its security rules.</p>
      <h3 class="text-xl font-semibold mt-6 mb-2">Basic Rules</h3>
      <p class="mb-4">By default, new Firestore databases deny all access. You must explicitly write rules to allow read or write operations. A common starting point is to allow read access for everyone but restrict write access to authenticated users.</p>
      <pre class="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto"><code class="language-firestore-rules">rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to posts
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
      </code></pre>
      <p class="mt-4">These rules are incredibly flexible, allowing you to define granular access control based on user roles, document data, and more. Mastering them is key to building a secure and scalable application with Firebase.</p>
    `,
    status: 'published',
    createdAt: new Date('2023-10-20T14:00:00Z'),
    updatedAt: new Date('2023-10-21T09:00:00Z'),
    author: AUTHORS[1],
    categories: [CATEGORIES[1], CATEGORIES[2]],
    tags: [TAGS[2]],
    featuredImage: 'https://picsum.photos/seed/firebase/800/400',
    viewsCount: 980
  },
  {
    id: 'post-3',
    title: 'UI/UX Design Principles for Developers',
    slug: 'ui-ux-design-principles-for-developers',
    content: `
      <p class="mb-4">As developers, we often focus on functionality, but a great user experience (UX) and user interface (UI) are what make an application truly successful. You don't need to be a designer to apply some fundamental principles that can dramatically improve your work.</p>
      <h3 class="text-xl font-semibold mt-6 mb-2">Key Principles</h3>
      <ul class="list-disc list-inside mb-4 pl-4">
        <li><strong>Consistency:</strong> Ensure that elements in your UI are consistent in appearance and behavior.</li>
        <li><strong>Hierarchy:</strong> Use size, color, and placement to guide the user's eye to the most important elements.</li>
        <li><strong>Feedback:</strong> Provide immediate and clear feedback for user actions.</li>
        <li><strong>Simplicity:</strong> Keep the interface clean and uncluttered. Every element should have a purpose.</li>
      </ul>
      <p class="mt-4">By keeping these principles in mind, you can create applications that are not only powerful but also intuitive and enjoyable to use.</p>
    `,
    status: 'published',
    createdAt: new Date('2023-09-15T08:00:00Z'),
    updatedAt: new Date('2023-09-15T11:00:00Z'),
    author: AUTHORS[0],
    categories: [CATEGORIES[2]],
    tags: [TAGS[3]],
    featuredImage: 'https://picsum.photos/seed/design/800/400',
    viewsCount: 2100
  }
];


@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly posts = signal<Post[]>(MOCK_POSTS);
  private readonly authors = signal<Author[]>(AUTHORS);
  private readonly categories = signal<Category[]>(CATEGORIES);
  private readonly tags = signal<Tag[]>(TAGS);

  readonly postCount = computed(() => this.posts().length);

  getPosts() {
    return this.posts.asReadonly();
  }
  
  getAuthors() {
    return this.authors.asReadonly();
  }

  getCategories() {
    return this.categories.asReadonly();
  }

  getPostById(id: string): Observable<Post | undefined> {
    const foundPost = this.posts().find(p => p.id === id);
    return of(foundPost);
  }

  getPostBySlug(slug: string): Observable<Post | undefined> {
    const foundPost = this.posts().find(p => p.slug === slug);
    return of(foundPost);
  }
  
  private createSlug(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }

  addPost(postData: Omit<Post, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) {
    const newPost: Post = {
      ...postData,
      id: `post-${Date.now()}`,
      slug: this.createSlug(postData.title),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.posts.update(posts => [newPost, ...posts]);
  }

  updatePost(updatedPost: Post) {
    updatedPost.updatedAt = new Date();
    updatedPost.slug = this.createSlug(updatedPost.title);
    this.posts.update(posts => 
      posts.map(p => p.id === updatedPost.id ? updatedPost : p)
    );
  }
  
  deletePost(postId: string) {
    this.posts.update(posts => posts.filter(p => p.id !== postId));
  }

  searchPosts(query: string): Observable<Post[]> {
    const lowerCaseQuery = query.toLowerCase().trim();
    if (!lowerCaseQuery) {
        return of([]);
    }
    
    const filteredPosts = this.posts().filter(post => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = post.content;
        const postContent = tempDiv.textContent || tempDiv.innerText || "";

        return post.title.toLowerCase().includes(lowerCaseQuery) ||
               postContent.toLowerCase().includes(lowerCaseQuery);
    });
    
    return of(filteredPosts);
  }
}