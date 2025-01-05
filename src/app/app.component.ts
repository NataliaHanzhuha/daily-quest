import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  firebaseConfig: any = {
    apiKey: "AIzaSyBWXJPkOBtpHfdBI55ceUu_jPdqSSoXe2M",
    authDomain: "daily-quest-3361f.firebaseapp.com",
    projectId: "daily-quest-3361f",
    storageBucket: "daily-quest-3361f.firebasestorage.app",
    messagingSenderId: "566987286470",
    appId: "1:566987286470:web:3075c3dd7b9569718974c7",
    measurementId: "G-PS5161CLDQ"
  };
}
