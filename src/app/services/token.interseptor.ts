import { HttpInterceptorFn, } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './server/auth.service';

export const bearerTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token;

  if (req.url.startsWith(environment.backendUrl) && token) {
    const authReq = req.clone({
      setHeaders: {Authorization: `Bearer ${token}`},
    });
    return next(authReq);
  }

  return next(req);
};
