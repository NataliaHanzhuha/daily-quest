import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseSDKHook } from '../../../base.hook';
import { EventBooking, Venue } from '../../../../models/task';
import { EventBookingService } from '../../../../services/server/event-booking.service';
import { VenueService } from '../../../../services/server/venue.service';
import { FirebaseService } from '../../../../services/firebase.service';
import { Observable, of, switchMap } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NoBookingFoundComponent } from '../no-booking-found/no-booking-found.component';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [
    CommonModule,
    NzCollapseModule,
    NzDividerModule,
    NzCardModule,
    NzIconModule,
    NzButtonModule,
    NoBookingFoundComponent,
  ],
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent extends BaseSDKHook {
  @Input() set bookingId(id: string) {
    this.eventId = id;
  }

  @Output() bookingChanged = new EventEmitter<EventBooking>();
  booking?: EventBooking;
  error: boolean = false;
  venue?: Venue;
  private eventId!: string;

  constructor(private bookingService: EventBookingService,
              private venueService: VenueService,
              private firebaseService: FirebaseService,
              protected override cd: ChangeDetectorRef) {
    super();
  }

  get currencySymbol(): string {
    return this.firebaseService.currencySymbol;
  }

  override ngOnInit(): void {
    this.initRefresh();
    this.refresh();
  }

  protected override getData = (): Observable<any> => {
    return this.bookingService.getBookingById(this.eventId)
      .pipe(
        catchError(() => {
          this.error = true;
          return of({} as EventBooking);
        }),
        tap((booking: EventBooking) => {
          this.booking = booking;
          this.bookingChanged.emit(booking);
        }),
        switchMap(() => {
          return this.booking?.venueId
            ?
            this.venueService.getVenueById(this.booking.venueId)
              .pipe(tap((venue: Venue) => {
                this.venue = venue;
              }))
            : of(null);
        })
      );
  };
}
