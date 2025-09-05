// src/app/services/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  const isPublic = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  if (token && !isPublic) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    console.log('[AuthInterceptor] Token attached:', token);
    return next(authReq);
  }

  return next(req);
};
