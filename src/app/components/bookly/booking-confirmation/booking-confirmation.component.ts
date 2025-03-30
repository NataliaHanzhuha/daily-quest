import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Ng-Zorro Modules
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';

// Services and Models
import { EventBooking, Venue } from '../../../models/task';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzResultModule,
    NzButtonModule,
    NzCardModule,
    NzDividerModule,
    NzSpinModule,
    NzIconModule,
    NzTypographyModule,
    NzMessageModule
  ],
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent implements OnInit, OnDestroy {
  bookingId: string = '';
  booking: EventBooking | undefined;
  venue: Venue | undefined;
  isLoading = false;
  error = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService,
    private message: NzMessageService
  ) {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.bookingId = params['bookingId'];
      if (this.bookingId) {
        this.loadBooking();
      } else {
        this.error = true;
      }
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBooking(): void {
    this.isLoading = true;
    this.firebaseService.getBookingById(this.bookingId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (booking) => {
          this.booking = booking;
          if (booking) {
            this.loadVenue(booking.venueId);
          } else {
            this.error = true;
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error('Error loading booking:', err);
          this.message.error('Failed to load booking details');
          this.error = true;
          this.isLoading = false;
        }
      });
  }

  loadVenue(venueId: string): void {
    this.firebaseService.getVenueById(venueId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (venue) => {
          this.venue = venue;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading venue:', err);
          this.message.error('Failed to load venue details');
          this.isLoading = false;
        }
      });
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) {
      return 'N/A';
    }

    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return parsedDate.toDateString();
  }

  // addToGoogleCalendar(): void {
  //   if (!this.bookingId) {
  //     return;
  //   }
  //
  //   this.isLoading = true;
  //   this.firebaseService.addToGoogleCalendar(this.bookingId)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (success) => {
  //         this.isLoading = false;
  //         if (success) {
  //           this.message.success('Event added to Google Calendar');
  //           if (this.booking) {
  //             this.booking.addToGoogleCalendar = true;
  //           }
  //         } else {
  //           this.message.error('Failed to add event to Google Calendar');
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Error adding to Google Calendar:', err);
  //         this.message.error('Failed to add event to Google Calendar');
  //         this.isLoading = false;
  //       }
  //     });
  // }

  browseVenues(): void {
    this.router.navigate(['/services']);
  }
}
