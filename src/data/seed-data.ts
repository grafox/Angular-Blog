import { User, UserRole } from '../models/user.model';
import { Author, Category, Post, Tag } from '../models/post.model';
import { Comment } from '../models/comment.model';

// --- Reusable Data Entities ---

export const SEED_AUTHORS_MAP = {
  'author-1': {
    id: 'author-1',
    name: 'Alex Johnson',
    profileImage: 'https://i.pravatar.cc/150?u=alexjohnson',
    bio: 'Alex is a senior frontend developer with a passion for clean architecture and modern web technologies. He specializes in Angular and performance optimization.'
  },
  'author-2': {
    id: 'author-2',
    name: 'Maria Garcia',
    profileImage: 'https://i.pravatar.cc/150?u=mariagarcia',
    bio: 'Maria is a full-stack engineer and a Firebase expert. She loves building scalable applications and sharing her knowledge with the community.'
  }
};

export const SEED_CATEGORIES_MAP = {
  'cat-1': {
    id: 'cat-1',
    name: 'Frameworks',
    slug: 'frameworks'
  },
  'cat-2': {
    id: 'cat-2',
    name: 'Cloud Services',
    slug: 'cloud-services'
  },
  'cat-3': {
    id: 'cat-3',
    name: 'Web Development',
    slug: 'web-development'
  }
};

export const SEED_TAGS_MAP = {
  'tag-1': { id: 'tag-1', name: 'Angular', slug: 'angular' },
  'tag-2': { id: 'tag-2', name: 'Firebase', slug: 'firebase' },
  'tag-3': { id: 'tag-3', name: 'TypeScript', slug: 'typescript' },
  'tag-4': { id: 'tag-4', name: 'Performance', slug: 'performance' },
  'tag-5': { id: 'tag-5', name: 'Realtime DB', slug: 'realtime-db' }
};


// --- Data for Firebase `set()` command ---

export const SEED_USERS = {
  'user-1': {
    name: 'Admin User',
    email: 'admin@angularblog.com',
    role: UserRole.Admin,
    profileImage: 'https://i.pravatar.cc/150?u=admin'
  },
  'user-2': {
    name: 'Editor User',
    email: 'editor@angularblog.com',
    role: UserRole.Editor,
    profileImage: 'https://i.pravatar.cc/150?u=editor'
  },
  'user-3': {
    name: 'Alex Johnson',
    email: 'alex@angularblog.com',
    role: UserRole.Author,
    profileImage: 'https://i.pravatar.cc/150?u=alexjohnson'
  }
};

export const SEED_AUTHORS = {
  'author-1': SEED_AUTHORS_MAP['author-1'],
  'author-2': SEED_AUTHORS_MAP['author-2']
};

export const SEED_CATEGORIES = {
  'cat-1': SEED_CATEGORIES_MAP['cat-1'],
  'cat-2': SEED_CATEGORIES_MAP['cat-2'],
  'cat-3': SEED_CATEGORIES_MAP['cat-3']
};

export const SEED_TAGS = {
  'tag-1': SEED_TAGS_MAP['tag-1'],
  'tag-2': SEED_TAGS_MAP['tag-2'],
  'tag-3': SEED_TAGS_MAP['tag-3'],
  'tag-4': SEED_TAGS_MAP['tag-4'],
  'tag-5': SEED_TAGS_MAP['tag-5'],
};

const now = new Date();
const post1Date = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(); // 2 days ago
const post2Date = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(); // 5 days ago
const post3Date = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(); // 10 days ago

export const SEED_POSTS = {
  'post-1': {
    title: 'Mastering Signals in Angular',
    slug: 'mastering-signals-in-angular',
    content: `
      <p>Angular Signals have revolutionized state management in Angular applications. They provide a reactive way to manage state that is both intuitive and highly performant. In this post, we'll dive deep into how signals work and how you can leverage them to build more efficient and maintainable apps.</p>
      <h2>What are Signals?</h2>
      <p>A signal is a wrapper around a value that can notify interested consumers when that value changes. You can create a signal with an initial value, and its value can be updated by calling its <code>set()</code> or <code>update()</code> method.</p>
      <pre class="ql-syntax" spellcheck="false">const count = signal(0);\ncount.set(10); // Set the value to 10\ncount.update(value => value + 1); // Update based on the current value\n</pre>
      <h2>Computed Signals</h2>
      <p>One of the most powerful features is <code>computed</code> signals. These are signals that derive their value from other signals. The framework ensures that the computed signal's value is automatically updated whenever its dependencies change.</p>
      <blockquote>This declarative approach simplifies complex state relationships and eliminates the need for manual change tracking.</blockquote>
    `,
    status: 'published',
    createdAt: post1Date,
    updatedAt: post1Date,
    author: SEED_AUTHORS_MAP['author-1'],
    categories: [SEED_CATEGORIES_MAP['cat-1'], SEED_CATEGORIES_MAP['cat-3']],
    tags: [SEED_TAGS_MAP['tag-1'], SEED_TAGS_MAP['tag-3'], SEED_TAGS_MAP['tag-4']],
    featuredImage: 'https://picsum.photos/seed/angular-signals/1200/800',
    viewsCount: 1024
  },
  'post-2': {
    title: 'Building Real-time Apps with Firebase',
    slug: 'building-real-time-apps-with-firebase',
    content: `
      <p>Firebase provides a powerful suite of tools to build full-stack applications quickly. Its Realtime Database is a NoSQL cloud database that lets you store and sync data between your users in realtime. Let's explore how to integrate it into an Angular application.</p>
      <h2>Setting up Firebase</h2>
      <p>First, you need to create a Firebase project in the Firebase console. Once you have your project configuration, you can initialize Firebase in your Angular app. It's best practice to do this in a dedicated service.</p>
      <pre class="ql-syntax" spellcheck="false">// firebase.service.ts\nimport { initializeApp } from "firebase/app";\nimport { getDatabase } from "firebase/database";\n\n// Your web app's Firebase configuration\nconst firebaseConfig = { ... };\n\nconst app = initializeApp(firebaseConfig);\nexport const database = getDatabase(app);\n</pre>
      <h2>Listening for Data</h2>
      <p>The <code>onValue</code> function from the Firebase SDK allows you to listen for changes at a specific database reference. This is the magic behind the realtime functionality. When data changes, your callback function is triggered with a snapshot of the new data.</p>
      `,
    status: 'published',
    createdAt: post2Date,
    updatedAt: post2Date,
    author: SEED_AUTHORS_MAP['author-2'],
    categories: [SEED_CATEGORIES_MAP['cat-2']],
    tags: [SEED_TAGS_MAP['tag-2'], SEED_TAGS_MAP['tag-5']],
    featuredImage: 'https://picsum.photos/seed/firebase-realtime/1200/800',
    viewsCount: 2450
  },
  'post-3': {
    title: 'A Guide to Modern Web Development',
    slug: 'a-guide-to-modern-web-development',
    content: `
      <p>The landscape of web development is constantly evolving. This guide provides a high-level overview of the tools and practices that define modern web development today.</p>
      <h2>Key Pillars</h2>
      <ul>
        <li><strong>Component-Based Architecture:</strong> Frameworks like Angular, React, and Vue have popularized building UIs with reusable components.</li>
        <li><strong>Reactive State Management:</strong> Effectively managing application state is crucial. Signals and libraries like RxJS are key players.</li>
        <li><strong>Serverless &amp; Edge Computing:</strong> Services like Firebase, Vercel, and Netlify have made it easier than ever to deploy scalable applications without managing servers.</li>
      </ul>
      <p>Staying current is a challenge, but by focusing on these fundamental pillars, you can build robust and modern web applications.</p>
      `,
    status: 'draft',
    createdAt: post3Date,
    updatedAt: post3Date,
    author: SEED_AUTHORS_MAP['author-1'],
    categories: [SEED_CATEGORIES_MAP['cat-3']],
    tags: [SEED_TAGS_MAP['tag-1'], SEED_TAGS_MAP['tag-2']],
    featuredImage: 'https://picsum.photos/seed/web-dev/1200/800',
    viewsCount: 50
  }
};


export const SEED_COMMENTS = {
  'comment-1': {
    postId: 'post-1',
    userId: 'user-2',
    userName: 'Editor User',
    userProfileImage: 'https://i.pravatar.cc/150?u=editor',
    content: 'Great article on Signals! This is a game-changer for Angular state management.',
    createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'approved'
  },
  'comment-2': {
    postId: 'post-2',
    userId: 'user-3',
    userName: 'Alex Johnson',
    userProfileImage: 'https://i.pravatar.cc/150?u=alexjohnson',
    content: 'Excellent overview of Firebase! The realtime capabilities are indeed powerful.',
    createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'approved'
  },
  'comment-3': {
    postId: 'post-2',
    userId: 'user-1',
    userName: 'Admin User',
    userProfileImage: 'https://i.pravatar.cc/150?u=admin',
    content: 'This comment is awaiting moderation.',
    createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  }
};


export const SEED_SITE_SETTINGS = {
  blogName: 'AngularFire Blog',
  title: 'Insights on Web Dev',
  subtitle: 'Exploring Angular, Firebase, and the future of the web. Your daily dose of modern development.',
  heroImageUrl: 'https://picsum.photos/seed/blog-hero-seed/1600/900',
};
