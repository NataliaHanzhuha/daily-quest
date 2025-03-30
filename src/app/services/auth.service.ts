import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from '@firebase/auth';
import { BehaviorSubject, of, take } from 'rxjs';
import { UserService } from './user.service';
import firebase from 'firebase/compat';
import UserCredential = firebase.auth.UserCredential;
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  private API_URL = 'http://localhost:4000/api/users'; // Backend API

  constructor(
    private angularFireAuth: AngularFireAuth,
    private http: HttpClient,
    private router: Router) {
  }

  get user(): any {
    return this.userSubject.value;
  }

  get userName(): string | null {
    return this.user?.displayName ?? null;
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const credential: UserCredential = await this.angularFireAuth.signInWithEmailAndPassword(email, password);
      const idToken = await credential?.user?.getIdToken() ?? null; // Get Firebase ID token
      this.userSubject.next(credential.user);
      // 🔥 Send token to backend to store role
      // return this.http.post<any>(`${this.API_URL}/login`, { idToken }, {headers}).toPromise();
    return of(credential.user);
    } catch (error) {
      console.error('Google Login Error:', error);
      await this.logout();
      return null;
    }
  }

  async logout(): Promise<any> {
    await this.angularFireAuth.signOut()
      .then(() => {
        this.userSubject.next(null);
      });
  }

  getCurrentUser(withRedirect = true): Promise<any> {
    return new Promise<any>((resolve) => {
      this.angularFireAuth.user.pipe(take(1)).subscribe((user) => {
        this.userSubject.next(user);
        if (withRedirect) {
          this.router.navigate([!!user ? '/admin' : '/categories']);
        }
        resolve(user);
      });
    });
  }
}

export function initAuth(authService: AuthService): () => Promise<any> {
  return () => authService.getCurrentUser();
}
