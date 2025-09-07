import { Routes } from '@angular/router';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogPostComponent } from './components/blog-post/blog-post.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { PostManagementComponent } from './components/admin/post-management/post-management.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { UserRole } from './models/user.model';
import { PostFormComponent } from './components/admin/post-form/post-form.component';
import { UserFormComponent } from './components/admin/user-form/user-form.component';

export const APP_ROUTES: Routes = [
  // Public Routes
  {
    path: '',
    component: BlogListComponent,
    title: 'Home | Angular CMS Blog'
  },
  {
    path: 'post/:slug',
    component: BlogPostComponent,
    title: 'Blog Post' // Title will be updated dynamically
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About | Angular CMS Blog'
  },
  {
    path: 'contact',
    component: ContactComponent,
    title: 'Contact | Angular CMS Blog'
  },
  {
    path: 'search',
    component: SearchResultsComponent,
    title: 'Search Results | Angular CMS Blog'
  },

  // Auth Route
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login | Angular CMS Blog'
  },

  // Admin Routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard | Admin' },
      { path: 'posts', component: PostManagementComponent, title: 'Manage Posts | Admin' },
      { path: 'posts/new', component: PostFormComponent, title: 'Create Post | Admin' },
      { path: 'posts/edit/:id', component: PostFormComponent, title: 'Edit Post | Admin' },
      {
        path: 'users',
        component: UserManagementComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.Admin] },
        title: 'Manage Users | Admin'
      },
      {
        path: 'users/new',
        component: UserFormComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.Admin] },
        title: 'Create User | Admin'
      },
      {
        path: 'users/edit/:id',
        component: UserFormComponent,
        canActivate: [roleGuard],
        data: { roles: [UserRole.Admin] },
        title: 'Edit User | Admin'
      }
    ]
  },

  // Wildcard Route
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];