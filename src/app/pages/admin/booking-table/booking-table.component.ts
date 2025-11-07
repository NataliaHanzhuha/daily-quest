import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { EventBooking, PaymentStatus, Venue } from '../../../models/task';
import { FirebaseService } from '../../../services/firebase.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, takeUntil } from 'rxjs/operators';
import { filter, of, take } from 'rxjs';
import { EventBookingService } from '../../../services/server/event-booking.service';
import { UnsubscribeHook } from '../../unsubscribe.hook';
import { CalendarFilterComponent } from '../admin-calendar/calendar-filter/calendar-filter.component';
import { BookingDetailsModalComponent } from '../admin-calendar/booking-details-modal/booking-details-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-booking-table',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzBadgeModule, NzTagModule, NzButtonModule, NzIconModule, NzPopconfirmModule, CalendarFilterComponent],
  templateUrl: './booking-table.component.html',
  styleUrls: ['./booking-table.component.scss']
})
export class BookingTableComponent extends UnsubscribeHook {
  bookings: EventBooking[] = [];
  venues: Map<string, Venue> = new Map();
  loading = true;
  filteredBooking: EventBooking[] = [];

  get currencySymbol(): string {
    return this.firebaseService.currencySymbol;
  }

  constructor(
    private firebaseService: FirebaseService,
    private message: NzMessageService,
    private eventBookingService: EventBookingService,
    private modalService: NzModalService
    // private venueService: VenueService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadBookings();
    // this.loadVenues();
  }


  setVenues(venues: Venue[]): void {
    venues.forEach((venue: Venue) => {
      this.venues.set(venue.id!, venue);
    });
  }

  showBookingDetails(booking?: EventBooking): void {
    const venueName = !!booking?.id
      ? this.venues.get(booking?.venueId)?.title
      : 'Unknown Venue';

    const modalRef = this.modalService.create({
      nzTitle: 'Booking Details',
      nzContent: BookingDetailsModalComponent,
      nzWidth: 750,
      nzData: {booking, venueName, color: !!booking?.id ? this.venues.get(booking!.venueId)?.color : '#eee'},
      nzFooter: null
    });

    modalRef.afterClose.pipe(take(1), filter(Boolean))
      .subscribe(() => {
        // let {from, to} = this.timeService.getCurrentWeekRange();
        //
        // this.loadBookings(from, to);
      });
  }

  applyFilters(data: {
    venueId: string | null,
    status: string | null,
  }): void {
    const arr = this.bookings.filter((booking: EventBooking) => {
      const venueMatch = !!data.venueId ? booking.venueId === data.venueId : true;
      const statusMatch = !!data.status ? booking.status === data.status : true;
      return venueMatch && statusMatch;
    });

    this.filteredBooking = [...arr].sort(this.sortFn);
    console.log(this.bookings, data);
  }

  private sortFn = (a: EventBooking, b: EventBooking) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime(); // ascending
  };

  loadBookings(): void {
    this.loading = true;
    this.eventBookingService.getBookings()
      .pipe(catchError((error) => {
        console.error('Error loading bookings:', error);
        this.message.error('Failed to load bookings');
        this.loading = false;

        return of([]);
      }), takeUntil(this.unsubscribe$))
      .subscribe((bookings) => {
        this.bookings = bookings;
        this.filteredBooking = [...bookings].sort(this.sortFn);
        this.loading = false;
      });
  }

  // loadVenues(): void {
  //   this.venueService.getVenues()
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe(
  //     venues => {
  //       venues.forEach(venue => this.venues.set(venue.id!, venue));
  //     },
  //     error => {
  //       console.error('Error loading venues:', error);
  //       this.message.error('Failed to load venues');
  //     }
  //   );
  // }

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

  confirmBooking(booking: EventBooking): void {
    this.loading = true;
    this.eventBookingService.updateBooking({...booking, status: 'confirmed'})
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
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

  cancelBooking(booking: EventBooking): void {
    this.loading = true;
    this.eventBookingService.updateBooking({...booking, status: 'cancelled'})
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
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
