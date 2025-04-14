import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventBookingService } from '../../../../../../services/server/event-booking.service';
import { ActivatedRoute } from '@angular/router';
import { Customer, EventBooking, Venue } from '../../../../../../models/task';
import { switchMap, take } from 'rxjs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { PaymentComponent } from '../booking/components/payment/payment.component';
import { TimeService } from '../../../../../../services/time.service';
import { EmailService } from '../../../../../../services/server/email.service';
import { BookingDetailsComponent } from '../../../../shared/booking-details/booking-details.component';

@Component({
  selector: 'app-payment-request',
  standalone: true,
  imports: [CommonModule, PaymentComponent, BookingDetailsComponent, NzCardModule,],
  templateUrl: './payment-request.component.html',
  styleUrls: ['./payment-request.component.scss']
})
export class PaymentRequestComponent {
  @ViewChild(BookingDetailsComponent) bookingDetailsComponent!: BookingDetailsComponent;

  booking?: EventBooking;
  eventId!: string;

  constructor(private bookingService: EventBookingService,
              private timeService: TimeService,
              private emailService: EmailService,
              private route: ActivatedRoute) {
    this.route.params
      .pipe(take(1))
      .subscribe(params => {
        this.eventId = params['id'];
      });
  }

  get description(): any {
    return {
      venue: this.bookingDetailsComponent.venue?.title,
      date: this.timeService.getDate(this.booking?.date),
      time: `${this.booking?.startTime}:00 - ${this.booking?.endTime}:00`,
      price: this.bookingDetailsComponent.currencySymbol + this.booking?.totalAmount
    };
  }

  get customer(): Customer | null {
    if (!this.booking) {
      return null;
    }

    return {
      fullName: this.booking.customerName,
      phone: this.booking.customerPhoneNumberPrefix + this.booking.customerPhone,
      price: this.booking.totalAmount,
      email: this.booking.customerEmail
    };
  }

  savePayment(payment: any): void {
    this.bookingService.updatePayment(payment.paymentId, this.booking!.id)
      .pipe(take(1),
        switchMap(() => this.emailService.sendEmailAfterAppointmentCreated(
          this.booking!, this.bookingDetailsComponent.venue!.title))
      ).subscribe(this.bookingDetailsComponent.refresh);
  }

  // testPayment(): void {
  //   this.emailService.sendEmailForPaymentAfterAdminCreatedEvent(this.booking!, this.bookingDetailsComponent.venue!.title)
  //     .subscribe(this.bookingDetailsComponent.refresh);
  // }

}
