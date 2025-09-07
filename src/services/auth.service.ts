import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole } from '../models/user.model';
import { of, Observable, delay } from 'rxjs';

const MOCK_USERS: User[] = [
  { id: 'admin-1', name: 'Admin User', email: 'admin@test.com', role: UserRole.Admin, profileImage: 'https://i.pravatar.cc/150?u=admin' },
  { id: 'editor-1', name: 'Editor User', email: 'editor@test.com', role: UserRole.Editor, profileImage: 'https://i.pravatar.cc/150?u=editor' },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  readonly currentUser = signal<User | null>(null);
  private readonly users = signal<User[]>(MOCK_USERS);

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }
  
  getUsers() {
    return this.users.asReadonly();
  }
  
  getUserById(id: string): Observable<User | undefined> {
    const foundUser = this.users().find(u => u.id === id);
    return of(foundUser);
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser()?.role === role;
  }
  
  addUser(userData: Omit<User, 'id'>) {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
    };
    this.users.update(users => [newUser, ...users]);
  }

  updateUser(updatedUser: User) {
    this.users.update(users => 
      users.map(u => u.id === updatedUser.id ? updatedUser : u)
    );
  }
  
  updateUserRole(userId: string, newRole: UserRole) {
    this.users.update(users => users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  }
  
  deleteUser(userId: string) {
    // Prevent self-deletion
    if (this.currentUser()?.id === userId) {
      console.error("You cannot delete your own account.");
      return;
    }
    this.users.update(users => users.filter(user => user.id !== userId));
  }

  login(role: UserRole): Observable<User | null> {
    const user = this.users().find(u => u.role === role) || null;
    if (user) {
      this.currentUser.set(user);
    }
    // Simulate network delay
    return of(user).pipe(delay(500));
  }

  logout(): void {
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}