import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import { catchError, finalize, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const loadingService = inject(LoadingService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  loadingService.show();

  const token = authService.token;
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'An error occurred. Please try again.';
      if (error.error?.message) {
        errorMsg = error.error.message;
      } else if (typeof error.error === 'string') {
        errorMsg = error.error;
      }

      const isLoginRequest = req.url.endsWith('/auth/login');

      if (error.status === 401 && !isLoginRequest) {
        authService.logout();
        toastService.error('Session Expired', 'Please login to continue.');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        toastService.error('Forbidden', 'You do not have permission to perform this action.');
      } else if (error.status === 0) {
        toastService.error('Server Unreachable', 'Unable to connect to backend Web API server.');
      } else {
        toastService.error('Error', errorMsg);
      }

      return throwError(() => error);
    }),
    finalize(() => {
      loadingService.hide();
    })
  );
};
