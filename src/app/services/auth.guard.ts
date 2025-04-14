import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './server/auth.service';


export const authGuard: CanActivateFn = async (route, state) => {
  const cookieService = inject(CookieService);
  const token = cookieService.get('token');

  return !token;

};

export const loginGuard: CanActivateFn = async (route, state) => {
  const cookieService = inject(AuthService);
  const token = cookieService.checkIfUserLogined();
  console.log(token);
  return !token;
};
