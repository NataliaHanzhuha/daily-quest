import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({providedIn: 'root'})
export class AuthService {
  userSubject = new BehaviorSubject<any>(null);
  private readonly url: string = environment.backendUrl + 'auth/';
  protected helper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    const token = this.cookieService.get('token');
    const data = this.helper.decodeToken(token);
    const isValid = !!token && !this.helper.isTokenExpired(token, 30);
    if (token && isValid) {
      this.userSubject.next({
        user_id: data.user_id,
        email: data.email,
      });
    }
  }

  // constructor(
  //   private angularFireAuth: AngularFireAuth,
  //   private http: HttpClient,
  //   private router: Router) {
  // }

  get user(): any {
    return this.userSubject.value;
  }

  get userName(): string | null {
    return this.user?.displayName ?? null;
  }

  get token(): string | null {
    return this.cookieService.get('token') ?? null;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.url + 'login', {email, password})
      .pipe(catchError(() => {
        this.router.navigate(['/login']);
        return of(null);
      }), tap((user: any) => {
        if (user) {
          this.userSubject.next(user.user);
          this.cookieService.set('token', user.token);
        }
      }));
  }

  logout(): Observable<any> {
    return this.http.post(this.url + 'logout', {}).pipe(tap(() => {
      this.userSubject.next(null);
      this.cookieService.delete('token');
    }));
  }

  checkIfUserLogined(): boolean {
    const token = this.token || this.cookieService.get('token');
    return !!token && !this.helper.isTokenExpired(token, 30);
  }

  checkUser(): Observable<any> {
    // const header = new Headers();
    return this.http.get(this.url + 'current-user');
  }

  getCurrentUser(): Promise<any> {
    return new Promise<any>((resolve) => {

      // this.angularFireAuth.user.pipe(take(1)).subscribe((user) => {
      //   this.userSubject.next(this.user);
      if (this.checkIfUserLogined()) {
        this.router.navigate([!!this.user ? '/admin' : '/']);
      }
      resolve(true);
      // });
    });
  }
}

export function initAuth(authService: AuthService): () => Promise<any> {
  return () => authService.getCurrentUser();
}
