import { Injectable, signal, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole } from '../models/user.model';
import { Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';
// FIX: Import `push`, `update`, and `remove` from firebase/database to resolve undefined function errors.
import { ref, onValue, set, get, push, remove, update } from 'firebase/database';
import { SEED_USERS } from '../data/seed-data';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private firebase = inject(FirebaseService);

  readonly currentUser = signal<User | null>(null);
  private readonly users = signal<User[]>([]);
  
  readonly userCount = computed(() => this.users().length);

  constructor() {
    this.seedUsersIfEmpty().then(() => {
       onValue(ref(this.firebase.db, 'users'), (snapshot) => {
        const usersObj = snapshot.val();
        if (usersObj) {
          const usersArray = Object.keys(usersObj).map(key => ({ ...usersObj[key], id: key }));
          this.users.set(usersArray);
        } else {
          this.users.set([]);
        }
      });
    });
  }

  private async seedUsersIfEmpty() {
    const usersRef = ref(this.firebase.db, 'users');
    const snapshot = await get(usersRef);
    if (!snapshot.exists()) {
      console.log('No users found in Firebase. Seeding database...');
      await set(usersRef, SEED_USERS);
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }
  
  getUsers() {
    return this.users.asReadonly();
  }
  
  getUserById(id: string): Observable<User | undefined> {
    return toObservable(this.users).pipe(
        map(users => users.find(u => u.id === id))
    );
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser()?.role === role;
  }
  
  addUser(userData: Omit<User, 'id'>) {
    const userListRef = ref(this.firebase.db, 'users');
    const newUserRef = push(userListRef);
    set(newUserRef, userData);
  }

  updateUser(updatedUser: User) {
    const userRef = ref(this.firebase.db, `users/${updatedUser.id}`);
    const userData = { ...updatedUser };
    delete (userData as any).id;
    set(userRef, userData);
  }
  
  updateUserRole(userId: string, newRole: UserRole) {
    const userRoleRef = ref(this.firebase.db, `users/${userId}`);
    update(userRoleRef, { role: newRole });
  }
  
  deleteUser(userId: string) {
    if (this.currentUser()?.id === userId) {
      console.error("You cannot delete your own account.");
      return;
    }
    remove(ref(this.firebase.db, `users/${userId}`));
  }

  login(role: UserRole): Observable<User | null> {
    const user = this.users().find(u => u.role === role) || null;
    if (user) {
      this.currentUser.set(user);
    }
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(user);
        observer.complete();
      }, 500);
    });
  }

  logout(): void {
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
