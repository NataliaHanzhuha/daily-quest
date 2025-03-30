import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { EventBooking, PaymentStatus, Venue } from '../../../../models/task';
import { FirebaseService } from '../../../../services/firebase.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-booking-table',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzBadgeModule, NzTagModule, NzButtonModule, NzIconModule, NzPopconfirmModule],
  templateUrl: './booking-table.component.html',
  styleUrls: ['./booking-table.component.scss']
})
export class BookingTableComponent {
  bookings: EventBooking[] = [];
  venues: Map<string, Venue> = new Map();
  loading = true;

  get currencySymbol(): string {
    return this.firebaseService.currencySymbol;
  }

  constructor(
    private firebaseService: FirebaseService,
    private message: NzMessageService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.loadBookings();
    this.loadVenues();
  }

  loadBookings(): void {
    this.loading = true;
    this.firebaseService.getBookings()
      .pipe(catchError((error) => {
        console.error('Error loading bookings:', error);
        this.message.error('Failed to load bookings');
        this.loading = false;

        return of([]);
      }))
      .subscribe((bookings) => {
        this.bookings = bookings;
        this.loading = false;
      });
  }

  loadVenues(): void {
    this.firebaseService.getVenues().subscribe(
      venues => {
        venues.forEach(venue => this.venues.set(venue.id!, venue));
      },
      error => {
        console.error('Error loading venues:', error);
        this.message.error('Failed to load venues');
      }
    );
  }

  getVenueById(id: string): Venue | undefined {
    return this.venues.get(id);
  }

  getVenueName(venueId: string): string {
    const venue = this.getVenueById(venueId);
    return venue ? venue.title : 'Unknown Venue';
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'paid':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'warning';
    }
  }

  getPaymentStatusBadge(status?: PaymentStatus): string {
    if (!status) {
      return 'default';
    }
    switch (PaymentStatus[status]) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'processing';
      default:
        return 'default';
    }
  }

  confirmBooking(id: string): void {
    this.loading = true;
    this.firebaseService.updateBookingStatus(id, 'confirmed').subscribe(
      success => {
        if (success) {
          this.message.success('Booking confirmed successfully');
          this.loadBookings();
        } else {
          this.message.error('Failed to confirm booking');
        }
        this.loading = false;
      },
      error => {
        console.error('Error confirming booking:', error);
        this.message.error('Failed to confirm booking');
        this.loading = false;
      }
    );
  }

  cancelBooking(id: string): void {
    this.loading = true;
    this.firebaseService.updateBookingStatus(id, 'cancelled').subscribe(
      success => {
        if (success) {
          this.message.success('Booking cancelled successfully');
          this.loadBookings();
        } else {
          this.message.error('Failed to cancel booking');
        }
        this.loading = false;
      },
      error => {
        console.error('Error cancelling booking:', error);
        this.message.error('Failed to cancel booking');
        this.loading = false;
      }
    );
  }


}
