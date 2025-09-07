import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User, UserRole } from '../../../models/user.model';
import { of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit {
  // FIX: Explicitly typed the injected FormBuilder to resolve a TypeScript error where it was being inferred as 'unknown'.
  private fb: FormBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  userForm!: FormGroup;
  isEditMode = signal(false);
  userId = signal<string | null>(null);
  
  userRoles = Object.values(UserRole).filter(role => role !== UserRole.Visitor);

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [UserRole.Author, Validators.required],
      profileImage: ['https://i.pravatar.cc/150', Validators.required],
    });

    this.route.paramMap.pipe(
      take(1),
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.isEditMode.set(true);
          this.userId.set(id);
          return this.authService.getUserById(id);
        }
        return of(undefined);
      })
    ).subscribe(user => {
      if (user) {
        this.userForm.patchValue(user);
      }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode() && this.userId()) {
      const updatedUser: User = {
        ...this.userForm.value,
        id: this.userId()!,
      };
      this.authService.updateUser(updatedUser);
    } else {
      this.authService.addUser(this.userForm.value);
    }

    this.router.navigate(['/admin/users']);
  }
}
