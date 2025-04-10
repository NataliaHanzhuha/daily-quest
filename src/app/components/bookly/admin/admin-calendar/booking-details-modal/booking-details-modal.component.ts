import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';

import { FirebaseService } from '../../../../../services/firebase.service';
import { Dropdown, EventBooking, Venue, WorkSchedule } from '../../../../../models/task';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { tap } from 'rxjs';
import { differenceInCalendarDays } from 'date-fns';
import { NzInputModule } from 'ng-zorro-antd/input';
import { countries, CountryInterface } from 'country-codes-flags-phone-codes';
import { EmailService } from '../../../../../services/email.service';
import { EventBookingService } from '../../../../../services/event-booking.service';
import { VenueService } from '../../../../../services/venue.service';
import { WorkScheduleService } from '../../../../../services/work-shedule.service';

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
    NzInputModule
  ],
  templateUrl: './booking-details-modal.component.html',
  styleUrls: ['./booking-details-modal.component.scss']
})
export class BookingDetailsModalComponent implements OnInit {
  booking!: EventBooking;
  isLoading = false;
  venues: Map<string, Venue> = new Map();
  startHour: number | null = null;
  availableTimeSlots: number[][] = [];
  selectedTime: number[] = [];
  readonly today = new Date();
  countries: CountryInterface[] = [];
  venueOptions: Dropdown[] = [];
  private schedules: { [key: number]: WorkSchedule } = {};

  constructor(
    private modalRef: NzModalRef,
    private firebaseService: FirebaseService,
    private message: NzMessageService,
    private cd: ChangeDetectorRef,
    private emailService: EmailService,
    private eventBookingService: EventBookingService,
    private venueService: VenueService,
    private workScheduleService: WorkScheduleService
  ) {
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
    this.booking = {...this.modalRef.getConfig().nzData.booking};
    console.log(this.booking);
  }

  get selectedDuration(): number {
    return this.booking.duration;
  }

  get selectedDate(): Date {
    return new Date(this.booking.date ?? this.booking.dateString);
  }

  get startWorkingDayTime(): number {
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

  ngOnInit(): void {
    this.getWorkingSchedule();
    this.loadVenues();
    this.checkAvailability();
  }

  sendConfirmEmail(): void {
    this.emailService.sendEmailAfterAppointmentCreated(this.booking, this.venues.get(this.booking.venueId)!.title)
      .subscribe();
  }

  setSelectedTime(time: number[]): void {
    console.log(time);
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
    const request = this.booking.id
      ? this.eventBookingService.updateBooking(this.booking)
      : this.eventBookingService.createBooking(this.booking);

    // TODO: add email send
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

  confirmBooking(booking: EventBooking): void {
    this.isLoading = true;
    this.eventBookingService.updateBooking({...booking, status: 'confirmed'}).subscribe({
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

  cancelBooking(booking: EventBooking): void {
    this.isLoading = true;
    this.eventBookingService.updateBooking({...booking, status: 'cancelled'}).subscribe({
      next: success => {
        this.isLoading = false;
        if (success) {
          this.message.success('Booking cancelled successfully');
          this.modalRef.close(true); // Pass true to indicate refresh is needed
        } else {
          this.message.error('Failed to cancel booking');
        }
      },
      error: err => {
        console.error('Error cancelling booking:', err);
        this.message.error('Failed to cancel booking');
        this.isLoading = false;
      }
    });
  }

  disabledDate = (current: Date | string): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(new Date(current), this.today) <= 0;

  onVenueChanged(): void {
    this.booking = {
      ...this.booking,
      date: '',
      startTime: '',
      endTime: '',
      totalAmount: 0,
      duration: this.venues.get(this.booking.venueId)!.minHours,
      attendees: Math.min(this.booking.attendees, this.venues.get(this.booking.venueId)!.capacity)
    };

    this.selectedTime = [];
    this.availableTimeSlots = [];
    this.cd.detectChanges();
  }

  checkAvailability(): void {
    if (!this.booking.venueId || !this.selectedDate) {
      return;
    }

    if (this.booking.id && this.disabledDate(this.booking?.date)) {
      console.log('eee');

      const timeOption = [+this.booking.startTime, +this.booking.endTime];
      this.availableTimeSlots = [timeOption];
      this.selectedTime = timeOption;
      this.cd.detectChanges();

      return;
    }

    this.isLoading = true;
    const workStartHour = this.startHour
      ? this.startHour
      : this.startWorkingDayTime;
    const dateString = this.selectedDate.toISOString();
    const {paddingBeforeMinutes, paddingAfterMinutes} = this.venues.get(this.booking.venueId) as Venue;

    this.eventBookingService.getAvailableSlots(
      this.booking.venueId,
      dateString.slice(0, dateString.indexOf('T')),
      this.selectedDuration * 60,
      paddingAfterMinutes ?? 0,
      paddingBeforeMinutes ?? 0)
      // .pipe(takeUntil(this.unsubscribe$))
      .subscribe((isAvailable: number[][]) => {
          this.isLoading = false;
          this.availableTimeSlots = isAvailable;

          if (this.booking.startTime && this.booking.endTime) {
            this.selectedTime = [+this.booking.startTime, +this.booking.endTime];
            this.cd.detectChanges();
          }
        },
        // error: (err) => {
        //   console.error('Error checking availability:', err);
        //   this.message.error('Failed to check availability. Please try again.');
        //   this.isLoading = false;
        // }
      );
  }

  // calculateTimeSlots(): void {
  //   // this.booking.startTime = '';
  //   // this.booking.endTime = '';
  //   this.selectedTime = [];
  //   this.setTotal();
  //   const workStartHour = this.startHour
  //     ? this.startHour
  //     : this.startWorkingDayTime;
  //
  //   const {paddingBeforeMinutes, paddingAfterMinutes} = this.venues.get(this.booking.venueId)!;
  //
  //   this.availableTimeSlots = this.timeService.findAvailableSlots(
  //     this.existingBookings, this.booking.venueId!, this.selectedDate!.toDateString(), workStartHour,
  //     this.endWorkingDayTime, this.selectedDuration * 60, paddingBeforeMinutes, paddingAfterMinutes);
  // }

  private setTotal(): void {
    const venuePrice = this.venues.get(this.booking.venueId)?.hourlyRate ?? 0;
    this.booking.totalAmount = this.booking.duration * venuePrice;
  }

  private loadVenues(): void {
    this.venueService.getVenues()
      // .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: venues => {
          venues.forEach(venue => this.venues.set(venue.id!, venue));
          const opt = Array.from(this.venues.values()).map((venue: Venue) => {
            return {
              label: venue.title,
              value: venue.id
            };
          });

          this.venueOptions = [{label: 'Not Selected', value: 'null'}, ...opt];
        },
        error: err => {
          console.error('Error loading venues:', err);
          this.message.error('Failed to load venues');
        }
      });
  }

  private getWorkingSchedule(): void {
    this.workScheduleService.getSchedules()
      .pipe(
        // takeUntil(this.unsubscribe$),
        tap((data) => {
          data.forEach((item) => {
            this.schedules[item.date] = item;
          });

          this.startHour = this.startWorkingDayTime;
        })
      ).subscribe();
  }
}
