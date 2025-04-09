import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private collectionName = 'users';
  // currentUser$: Observable<User | null | undefined>;

  constructor(
    // private afAuth: AngularFireAuth,
    // private firestore: AngularFirestore
  ) {
    // Get the currently logged-in user
    // this.currentUser$ = this.afAuth.authState.pipe(
    //   switchMap((user: any) => {
    //     if (!!user) {
    //       return this.firestore.collection<User>(this.collectionName).doc(user.uid).valueChanges();
    //     } else {
    //       return of(null);
    //     }
    //   })
    // );
  }

  // getUsers(): Observable<User[]> {
  //   return this.firestore.collection<User>(this.collectionName).valueChanges();
  // }
  //
  // // Delete User
  // async deleteUser(uid: string): Promise<void> {
  //   return this.firestore.collection(this.collectionName).doc(uid).delete();
  // }
  //
  // // Get User Role
  // getUserRole(uid: string): Observable<string | null> {
  //   return this.firestore.collection<User>(this.collectionName).doc(uid).valueChanges().pipe(
  //     map(user => user ? user.role : null)
  //   );
  // }
  //
  // // Check Role Permissions
  // hasRole(requiredRole: 'admin' | 'editor' | 'viewer'): Observable<boolean> {
  //   return this.currentUser$.pipe(
  //     map(user => user ? user.role === requiredRole : false)
  //   );
  // }
  //
  // // Update User Role
  // async updateUserRole(uid: string, role: 'admin' | 'editor' | 'viewer'): Promise<void> {
  //   return this.firestore.collection(this.collectionName).doc(uid).update({ role });
  // }
}
