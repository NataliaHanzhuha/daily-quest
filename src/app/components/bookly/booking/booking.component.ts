import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { filter, Observable, of, switchMap } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

// Ng-Zorro Modules
import { NzMessageService } from 'ng-zorro-antd/message';

// Services and Models
import { Customer, EventBooking, PaymentDetails, Venue, WeekDay } from '../../../models/task';

// Square Payment Component
import { FirebaseService } from '../../../services/firebase.service';
import { TimeService } from '../../../services/time.service';
import { PaymentComponent } from './components/payment/payment.component';
import { CustomerInfoComponent } from './components/customer-info/customer-info.component';
import { AuthService } from '../../../services/auth.service';
import { DateAndTimeComponent } from './components/date-and-time/date-and-time.component';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { VenueService } from '../../../services/venue.service';
import { CategoryService } from '../../../services/category.service';
import { EventBookingService } from '../../../services/event-booking.service';
import { UnsubscribeHook } from '../../unsubscribe.hook';
import { EmailService } from '../../../services/email.service';


@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PaymentComponent,
    CustomerInfoComponent,
    DateAndTimeComponent,
    NzStepsModule,
    NzFormModule,
    NzButtonModule,
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent extends UnsubscribeHook implements OnInit {
  currentStep = 0;
  venue!: Venue;
  bookingForm!: FormGroup;
  isLoading = false;
  readonly today = new Date();
  customer?: Customer;
  payment?: PaymentDetails;
  @Output() bookingId = new EventEmitter<null | string>();
  @Input() venueId: string = '';
  @Output() venueIdChanged = new EventEmitter<null>();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private firebaseService: FirebaseService,
    private timeService: TimeService,
    private authService: AuthService,
    private venueService: VenueService,
    private categoryService: CategoryService,
    private eventBookingService: EventBookingService,
    private emailService: EmailService
  ) {
    super();
    this.createForm();
    this.setRulesForForm();
  }

  get totalCost(): number {
    if (!this.venue?.hourlyRate || !this.selectedDuration) {
      return 0;
    }

    return this.venue?.hourlyRate * this.selectedDuration;
  }

  get currencySymbol(): string {
    return this.firebaseService.currencySymbol;
  }

  get selectedDate(): Date | undefined {
    return this.bookingForm.get('date')?.value as Date;
  }

  get startTime(): number | null {
    return this.bookingForm.get('startTime')?.value;
  }

  get selectedDateFormatting(): string {
    if (!this.selectedDate) {
      return '';
    }

    const weekDay = this.selectedDate.getDay();
    const month = this.selectedDate.getMonth() + 1;
    const day = this.selectedDate.getDate();
    const year = this.selectedDate.getFullYear();

    return `${WeekDay[weekDay]} ,${day}/${month}/${year}`;
  }

  get endTime(): number | null {
    return this.bookingForm.get('endTime')?.value;
  }

  get selectedDuration(): number {
    return this.bookingForm.get('duration')?.value;
  }

  ngOnInit() {
    if (this.venueId) {
      this.loadVenue();
    }
  }

  setPayment(payment: PaymentDetails): void {
    this.payment = payment;

    if (payment.paymentStatus === 'paid' && payment.paymentType === 'online') {
      this.processBookingWithPayment();
    }
  }

  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    this.currentStep--;
  }

  validateCurrentStep(markControls = true): boolean {
    let valid = false;

    switch (this.currentStep) {
      case 0: // Date and Time
        const dateTimeControls = ['date', 'startTime', 'endTime', 'duration'];
        valid = this.validateFormControls(dateTimeControls, markControls);
        break;
      case 1: // Customer Information
        const customerControls = ['customerName', 'customerEmail', 'customerPhoneNumberPrefix', 'customerPhone', 'eventType', 'attendees'];
        valid = this.validateFormControls(customerControls, markControls);

        if (valid) {
          this.customer = {
            fullName: this.bookingForm.get('customerName')?.value,
            email: this.bookingForm.get('customerEmail')?.value,
            phone: this.bookingForm.get('customerPhoneNumberPrefix')?.value + this.bookingForm.get('customerPhone')?.value,
            price: this.totalCost
          };
        }
        break;
      case 2: // Payment and Confirmation
        valid = true; // No validation needed for this step
        break;
      default:
        valid = true;
    }

    return valid;
  }

  // Process the booking after payment is successful
  processBookingWithPayment(): void {
    if (this.bookingForm.invalid) {
      Object.values(this.bookingForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
      return;
    }

    const formValue = this.bookingForm.value;
    const booking: Omit<EventBooking, 'id' | 'paymentStatus' | 'paymentId'> = {
      venueId: this.venueId,
      date: formValue.date,
      startTime: formValue.startTime,
      endTime: formValue.endTime,
      duration: formValue.duration,
      customerName: formValue.customerName,
      customerEmail: formValue.customerEmail,
      customerPhone: formValue.customerPhone,
      customerPhoneNumberPrefix: formValue.customerPhoneNumberPrefix,
      eventType: formValue.eventType,
      attendees: formValue.attendees,
      status: 'pending',
      totalAmount: this.totalCost,
      addToGoogleCalendar: formValue.addToGoogleCalendar,
      userId: this.authService?.user?.userId ?? null,
      createdAt: new Date(),
      paymentDetails: this.payment
    };

    // Process booking with Square payment ID
    this.eventBookingService.createBooking(booking)
      .pipe(
        catchError((err) => {
          console.error('Error creating booking:', err);
          this.message.error('Failed to create booking. Please try again.');
          this.isLoading = false;
          return of(null);
        }),
        filter(Boolean),
        switchMap((newBooking: EventBooking) => {
          return this.emailService.sendEmailAfterAppointmentCreated(newBooking, this.venue?.title)
            .pipe(map(() => newBooking));
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((result: EventBooking) => {
        this.isLoading = false;

        this.message.success('Booking created successfully!');
        this.bookingId.emit(result.id);
      });
  }

  private loadVenue(): void {
    this.venueService.getVenueById(this.venueId)
      // @ts-ignore
      .pipe(switchMap((venue: Venue | undefined) => {
        if (!venue) {
          return of(null);
        } else {
          this.venue = venue;

          if (this.venue.categoryId) {
            return this.loadCategoryDetails(this.venue.categoryId);
          }
        }
      }))
      .subscribe();
  }

  private loadCategoryDetails(categoryId: string): Observable<Venue> {
    return this.categoryService.getCategoryById(categoryId)
      .pipe(map(category => {
        this.venue.categoryName = category?.title ?? 'Uncategorized';

        return this.venue;
      }));
  }

  private setRulesForForm(): void {
    if (this.venue) {
      // Set default duration to min hours
      this.bookingForm.patchValue({
        duration: this.venue.minHours
      });

      // Update validators for duration
      this.bookingForm.get('duration')?.setValidators([
        Validators.required,
        Validators.min(this.venue.minHours),
        Validators.max(this.venue.maxHours)
      ]);

      // Update validators for attendees
      this.bookingForm.get('attendees')?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(this.venue.capacity)
      ]);

      this.bookingForm.get('duration')?.updateValueAndValidity();
      this.bookingForm.get('attendees')?.updateValueAndValidity();
    }
  }

  private createForm(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.bookingForm = this.fb.group({
      // Step 1: Date and Time
      date: [this.timeService.resetToMidnight(tomorrow), Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      duration: [2, [Validators.required, Validators.min(1)]],

      // Step 2: Customer Information
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
      customerPhoneNumberPrefix: ['+234', Validators.required],
      eventType: ['', Validators.required],
      attendees: [1, [Validators.required, Validators.min(1)]],

      // Step 3: Additional Options
      addToGoogleCalendar: [false]
    });
  }

  private validateFormControls(controlNames: string[], makrControls = true): boolean {
    let valid = true;

    controlNames.forEach(controlName => {
      const control = this.bookingForm.get(controlName);
      if (control?.invalid) {
        if (makrControls) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }

        valid = false;
      }
    });

    return valid;
  }
}
