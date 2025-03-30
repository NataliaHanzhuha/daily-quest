import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventBooking, Venue } from '../../../models/task';

// ng-zorro modules
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

// Components
import { CategoryManagementComponent } from './category-management/category-management.component';
import { VenueManagementComponent } from './venue-management/venue-management.component';
import { AdminCalendarComponent } from './admin-calendar/admin-calendar.component';
import { WorkScheduleComponent } from './work-schedule/work-schedule.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../../services/auth.service';
import { BookingTableComponent } from './booking-table/booking-table.component';
import { UserManagementComponent } from './user-management/user-management.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NzTabsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzBadgeModule,
    NzTagModule,
    NzPopconfirmModule,
    NzMessageModule,
    NzSpinModule,
    NzEmptyModule,
    CategoryManagementComponent,
    VenueManagementComponent,
    AdminCalendarComponent,
    WorkScheduleComponent,
    BookingTableComponent,
    UserManagementComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  bookings: EventBooking[] = [];
  venues: Map<string, Venue> = new Map();
  isLoading = false;
  activeTabIndex = 2;
  loading = true;
  user: any = null;
  title: any;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService
  ) {
    this.angularFireAuth.user.subscribe((u) => {
      this.user = u;
      if (!this.user) {
        this.router.navigate(['/categories']);
      }
      console.log(this.user);
      if (!this.router.url || this.router.url === '/') {
        this.router.navigate([!!u?.displayName ? '/admin' : '/login']);
      }
      this.loading = false;
    });
  }

  ngOnInit(): void {

  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  onTabChange(index: number): void {
    this.activeTabIndex = index;
  }
}
