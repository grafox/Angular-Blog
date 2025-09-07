import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = route.data['roles'] as UserRole[];

  if (!expectedRoles || expectedRoles.length === 0) {
    return true;
  }

  const currentUser = authService.currentUser();
  
  if (!currentUser || !expectedRoles.includes(currentUser.role)) {
    // Redirect to the admin dashboard if the user doesn't have the required role
    return router.parseUrl('/admin/dashboard');
  }

  return true;
};
