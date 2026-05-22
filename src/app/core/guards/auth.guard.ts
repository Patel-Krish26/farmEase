import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getRole();
  const allowedRoles = route.data['roles'] as Array<UserRole>;

  // 1. Check if logged in
  if (!authService.isLoggedIn()) {
    return router.parseUrl('/Login');
  }

  // 2. Check if the route has specific role requirements
  if (allowedRoles && !allowedRoles.includes(userRole!)) {
    alert('Access Denied: You do not have the required permissions.');
    return router.navigate(['/']);
  }

  return true;
};
