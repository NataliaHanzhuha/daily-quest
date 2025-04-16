import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';

import { FirebaseService } from '../../../../services/firebase.service';
import { Dropdown, EventBooking, PaymentStatus, Venue, WorkSchedule } from '../../../../models/task';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { of, switchMap, take, tap } from 'rxjs';
import { differenceInCalendarDays } from 'date-fns';
import { NzInputModule } from 'ng-zorro-antd/input';
import { countries, CountryInterface, getCountryDialCodeFromCountryCodeOrNameOrFlagEmoji } from 'country-codes-flags-phone-codes';
import { EmailService } from '../../../../services/server/email.service';
import { EventBookingService } from '../../../../services/server/event-booking.service';
import { VenueService } from '../../../../services/server/venue.service';
import { WorkScheduleService } from '../../../../services/server/work-shedule.service';
import { TimeService } from '../../../../services/time.service';
import { AuthService } from '../../../../services/server/auth.service';
import { BaseSDKHook } from '../../../base.hook';
import { takeUntil } from 'rxjs/operators';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-booking-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzDividerModule,
    NzTagModule,
    NzButtonModule,
    NzSpinModule,
    NzMessageModule,
    NzModalModule,
    NzSelectModule,
    FormsModule,
    NzDatePickerModule,
    NzFormModule,
    NzGridModule,
    NzInputNumberModule,
    ReactiveFormsModule,
    NzInputModule,
    NzDropDownModule
  ],
  templateUrl: './booking-details-modal.component.html',
  styleUrls: ['./booking-details-modal.component.scss']
})
export class BookingDetailsModalComponent extends BaseSDKHook implements OnInit {
  booking!: EventBooking;
  isLoading = false;
  venues: Map<string, Venue> = new Map();
  venuesList: Venue[] = [];
  startHour: number | null = null;
  availableTimeSlots: number[][] = [];
  selectedTime: number[] = [];
  readonly today = new Date();
  countries: CountryInterface[] = [];
  venueOptions: Dropdown[] = [];
  statusOptions: Dropdown[] = ['pending', 'paid', 'confirmed', 'cancelled']
    .map((status: string) => {
      return {label: status, value: status};
    });
  eventType: Dropdown[] = ['Wedding', 'Birthday', 'Corporate', 'Conference', 'Party', 'Other']
    .map((status: string) => {
      return {label: status, value: status};
    });

  private schedules: { [key: number]: WorkSchedule } = {};

  constructor(
    private modalRef: NzModalRef,
    private firebaseService: FirebaseService,
    private message: NzMessageService,
    override cd: ChangeDetectorRef,
    private emailService: EmailService,
    private eventBookingService: EventBookingService,
    private venueService: VenueService,
    private workScheduleService: WorkScheduleService,
    private timeService: TimeService,
    private auth: AuthService
  ) {
    super();
    this.setCountries();
    this.booking = {...this.modalRef.getConfig().nzData.booking};
    this.loadVenues();
  }

  get selectedDuration(): number {
    return this.booking.duration;
  }

  get selectedDate(): Date {
    return new Date(this.timeService.getDate(this.booking.date) ?? this.timeService.getDate(this.booking.dateString));
  }

  get startWorkingDayTime(): number {
    // console.log(this.selectedDate, this.schedules[this.selectedDate.getDay()]?.startTime);
    return this.selectedDate
      ? +this.schedules[this.selectedDate.getDay()]?.startTime
      : 8;
  }

  get endWorkingDayTime(): number {
    return this.selectedDate
      ? +this.schedules[this.selectedDate.getDay()]?.endTime
      : 22;
  }

  get currencySymbol(): string {
    return this.firebaseService.currencySymbol;
  }

  get venueColor(): string {
    return this.venues.get(this.booking.venueId)?.color ?? '#000';
  }

  override ngOnInit(): void {
    this.getWorkingSchedule();
    this.initRefresh();
    if (!this.booking?.id) {
      this.booking.customerPhoneNumberPrefix = getCountryDialCodeFromCountryCodeOrNameOrFlagEmoji('Nigeria') ?? '';
      this.booking.status = 'pending';
    } else {
      this.refresh();
    }

    this.cd.detectChanges();
  }

  sendConfirmEmail(): void {
    this.emailService.sendEmailAfterAppointmentCreated(this.booking, this.venues.get(this.booking.venueId)!.title)
      .subscribe();
  }

  updateStatus(status: any): void {
    if ((status === 'confirmed' || status === 'paid') && this.booking.paymentDetails?.paymentStatus !== 'paid') {
      this.sendPaymentEmail();
      this.message.warning('Payment request Email was sent to the customer');
      return;
    }
    this.eventBookingService.updateBookingStatus(this.booking.id, status)
      .pipe(take(1)).subscribe();
  }

  sendPaymentEmail(): void {
    this.emailService.sendEmailForPaymentAfterAdminCreatedEvent(this.booking, this.venues.get(this.booking.venueId)!.title)
      .subscribe();
  }

  setSelectedTime(time: number[]): void {
    this.booking.startTime = time[0].toString();
    this.booking.endTime = time[1].toString();
    this.setTotal();
    this.cd.detectChanges();
  }

  closeModal(): void {
    this.modalRef.close(null);
  }

  save(): void {
    this.isLoading = true;
    this.booking.paymentDetails = {
      paymentStatus: PaymentStatus.unpaid,
      paymentType: 'online',
      requestDate: new Date().toISOString(),
      collectedBy: this.auth.user.user_id,
    };
    this.booking.userId = this.auth.user?.user_id;

    const request = this.booking.id
      ? this.eventBookingService.updateBooking(this.booking)
      : this.eventBookingService.createBooking(this.booking)
        .pipe(switchMap(
          (booking: EventBooking) => this.emailService.sendEmailForPaymentAfterAdminCreatedEvent(booking, this.venues.get(booking.venueId)!.title)));
    request.subscribe({
      next: success => {
        this.isLoading = false;
        if (success) {
          this.message.success('Booking confirmed successfully');
          this.modalRef.close(true); // Pass true to indicate refresh is needed
        } else {
          this.message.error('Failed to confirm booking');
        }
      },
      error: err => {
        console.error('Error confirming booking:', err);
        this.message.error('Failed to confirm booking');
        this.isLoading = false;
      }
    });
  }

  disabledDate = (current: Date | string): boolean => differenceInCalendarDays(new Date(current), this.today) <= 0;

  onVenueChanged(): void {
    if (this.booking.id) {
      this.booking = {
        ...this.booking,
        date: '',
        startTime: '',
        endTime: '',
        totalAmount: 0,
        duration: this.venues.get(this.booking.venueId)!.minHours,
        attendees: Math.min(this.booking.attendees, this.venues.get(this.booking.venueId)!.capacity)
      };
    } else {
      this.booking = {
        ...this.booking,
        totalAmount: 0,
        duration: this.venues.get(this.booking.venueId)!.minHours,
        attendees: Math.min(this.booking?.attendees ?? 1, this.venues.get(this.booking.venueId)!.capacity)
      };
    }


    this.selectedTime = [];
    this.availableTimeSlots = [];
    this.cd.detectChanges();
  }

  protected getData = () => {
    console.log(this.booking, this.selectedDate, this.disabledDate(this.booking?.date));
    if (this.booking?.venueId === 'null' || !this.selectedDate) {
      return of(null);
    }

    if (this.booking.id && this.disabledDate(this.booking?.date)) {
      const timeOption = [+this.booking.startTime, +this.booking.endTime];
      this.availableTimeSlots = [timeOption];
      this.selectedTime = timeOption;
      this.cd.detectChanges();

      return of(null);
    }

    this.loadStart();
    const workStartHour = this.startHour
      ? this.startHour
      : this.startWorkingDayTime;
    const dateString = this.selectedDate?.toISOString();
    const venue = this.venues.get(this.booking.venueId) as Venue;
    const {paddingBeforeMinutes = 0, paddingAfterMinutes = 0} = venue ?? {};

    return this.eventBookingService.getAvailableSlots(
      this.booking.venueId,
      dateString.slice(0, dateString.indexOf('T')),
      workStartHour,
      this.endWorkingDayTime,
      this.selectedDuration * 60,
      paddingAfterMinutes,
      paddingBeforeMinutes)
      .pipe(tap((slots: number[][]) => {
          this.availableTimeSlots = slots;

          if ((this.booking.date || this.timeService.checkIfItSameDay(dateString, this.booking.date)) && !slots.length) {
            const range = [+this.booking.startTime, +this.booking.endTime];
            this.availableTimeSlots = [range];
            this.selectedTime = range;
          }

          // console.log(this.availableTimeSlots, this.selectedTime);
          this.loadStop();
        })
      );
  };

  private setCountries(): void {
    const favorites: string[] = ['Nigeria', 'United States', 'Canada'];
    this.countries = [...countries].sort((a, b) => {
      const isAFavorite = favorites.includes(a.name);
      const isBFavorite = favorites.includes(b.name);

      if (isAFavorite && !isBFavorite) {
        return -1;
      } // a comes first
      if (!isAFavorite && isBFavorite) {
        return 1;
      }  // b comes first
      return 0; // maintain order
    });
  }

  private setTotal(): void {
    const venuePrice = this.venues.get(this.booking.venueId)?.hourlyRate ?? 0;
    this.booking.totalAmount = this.booking.duration * venuePrice;
  }

  private loadVenues(): void {
    this.venueService.getVenues()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((venues) => {
        this.venuesList = venues;
        venues.forEach(venue => this.venues.set(venue.id!, venue));
        const opt = Array.from(this.venues.values()).map((venue: Venue) => {
          return {
            label: venue.title,
            value: venue.id
          };
        });

        this.venueOptions = [{label: 'Not Selected', value: 'null'}, ...opt];
      });
  }

  private getWorkingSchedule(): void {
    this.workScheduleService.getSchedules()
      .pipe(
        take(1),
        tap((data) => {
          data.forEach((item) => {
            this.schedules[item.date] = item;
          });

          this.startHour = this.startWorkingDayTime;
          this.cd.detectChanges();
        })
      ).subscribe();
  }
}
