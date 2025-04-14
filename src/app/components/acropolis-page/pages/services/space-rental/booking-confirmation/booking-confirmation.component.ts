import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
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
import { Venue } from '../../../../../../models/task';
import { UnsubscribeHook } from '../../../../../unsubscribe.hook';
import { EventBookingService } from '../../../../../../services/server/event-booking.service';
import { NoBookingFoundComponent } from '../../../../shared/no-booking-found/no-booking-found.component';

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
    NzMessageModule,
    NoBookingFoundComponent
  ],
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent extends UnsubscribeHook implements OnInit, OnDestroy {
  @Input() bookingId: string | null = null;
  booking = false;
  venue: Venue | undefined;
  isLoading = false;
  error = false;

  constructor(
    private router: Router,
    private message: NzMessageService,
    private eventBookingService: EventBookingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadBooking();
  }

  browseVenues(): void {
    this.router.navigate(['/']);
  }

  private loadBooking(): void {
    if (!this.bookingId) {
      this.error = true;
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.eventBookingService.bookingExists(this.bookingId)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => {
          this.isLoading = false;
        }))
      .subscribe((booking: boolean) => {
        this.booking = booking;

        if (!booking) {
          this.error = true;
        }

        this.isLoading = false;
      });
  }
}
