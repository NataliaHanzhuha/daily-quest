import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
    loading = true;
    user: any = null;
    title: any;

    constructor(
        // private angularFireAuth: AngularFireAuth,
        // private router: Router,
        // private authService: AuthService
    ) {}

    ngOnInit(): void {
        // this.angularFireAuth.user.subscribe((u) => {
        //     this.user = u;
        //     if (!this.router.url || this.router.url === '/') {
        //         this.router.navigate([u?.displayName ? '/' : '/login']);
        //     }
        //     this.loading = false;
        // });
    }

    // isLoggedIn(): boolean {
    //     return !!this.user;
    // }
    //
    // logout(): void {
    //     this.authService.logout().then(() => {
    //         this.router.navigate(['/login']);
    //     });
    // }
}
