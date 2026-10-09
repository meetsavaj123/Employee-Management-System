import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (authService.isAdmin) {
    return true;
  }

  toastService.error('Access Denied', 'Admin privileges are required to access this section.');
  router.navigate(['/dashboard']);
  return false;
};
