import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTransitionPatchModule } from 'ng-zorro-antd/core/transition-patch/transition-patch.module';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { differenceInCalendarDays } from 'date-fns';
import { TimeService } from '../../../../../services/time.service';
import { EventBooking, Venue, WorkSchedule } from '../../../../../models/task';
import { takeUntil } from 'rxjs/operators';
import { tap } from 'rxjs';
import { FirebaseService } from '../../../../../services/firebase.service';
import { UnsubscribeHook } from '../../../../unsubscribe.hook';
import { NzMessageService } from 'ng-zorro-antd/message';
import { WorkScheduleService } from '../../../../../services/work-schedule.service';
import { EventBookingService } from '../../../../../services/event-booking.service';

@Component({
  selector: 'app-date-and-time',
  standalone: true,
  imports: [
    CommonModule,
    NzAlertModule,
    NzButtonModule,
    NzCalendarModule,
    NzFormModule,
    NzGridModule,
    NzInputNumberModule,
    NzWaveModule,
    ReactiveFormsModule
  ],
  templateUrl: './date-and-time.component.html',
  styleUrls: ['./date-and-time.component.scss']
})
export class DateAndTimeComponent extends UnsubscribeHook implements OnInit {
  @Input() venue!: Venue;
  @Output() change = new EventEmitter();

  readonly today = new Date();
  bookingForm!: FormGroup;
  private schedules: { [key: number]: WorkSchedule } = {};
  startHour = new FormControl<number | null>(null);
  availableTimeSlots: number[][] = [];
  isLoading = false;
  private existingBookings: EventBooking[] = [];

  get selectedDate(): Date | undefined {
    return this.bookingForm.get('date')?.value as Date;
  }

  get startTime(): number | null {
    return this.bookingForm.get('startTime')?.value;
  }

  get endTime(): number | null {
    return this.bookingForm.get('endTime')?.value;
  }

  get selectedDuration(): number {
    return this.bookingForm.get('duration')?.value;
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

  get selectedStartTime(): number | null {
    return this.startHour.value ?? null;
  }

  constructor(
    private timeService: TimeService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private message: NzMessageService,
    private workScheduleService: WorkScheduleService,
    private eventBookingService: EventBookingService
  ) {
    super();
    this.createForm();
  }

  ngOnInit(): void {
    this.getWorkingSchedule();
    this.setRulesForForm();
    // Calculate total cost when duration changes
    this.bookingForm.get('duration')?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(duration => {
        this.bookingForm.patchValue({
          startTime: null,
          endTime: null,
        });
        this.checkAvailability();
        this.cd.detectChanges();
      });

    this.bookingForm.get('date')?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.bookingForm.patchValue({
          startTime: null,
          endTime: null,
        });
        this.checkAvailability();
        this.cd.detectChanges();
      });

    this.startHour?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.checkAvailability();
        this.cd.detectChanges();
      });

    this.bookingForm.valueChanges.subscribe((value: any) => {
      this.change.emit(value);
    });

    this.bookingForm.get('duration')?.setValue(this.venue.minHours ?? 2);
  }

  private checkAvailability(): void {
    if (!this.venue?.id || !this.selectedDate) {
      return;
    }

    this.isLoading = true;
    const workStartHour = this.selectedStartTime
      ? this.selectedStartTime
      : this.startWorkingDayTime;
    const dateString = this.selectedDate.toISOString();
    const {paddingBeforeMinutes, paddingAfterMinutes} = this.venue;

    this.eventBookingService.checkVenueAvailability(
      this.venue?.id, dateString.slice(0, dateString.indexOf('T')), workStartHour,
      this.endWorkingDayTime, this.selectedDuration * 60,
      paddingBeforeMinutes, paddingAfterMinutes)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (slots: number[][]) => {
          this.isLoading = false;
          this.availableTimeSlots = slots;
        },
        error: (err) => {
          console.error('Error checking availability:', err);
          this.message.error('Failed to check availability. Please try again.');
          this.isLoading = false;
        }
      });
  }

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.today) <= 0;

  onValueChange(value: Date): void {
    this.bookingForm.get('date')?.setValue(this.timeService.resetToMidnight(value));
    console.log(`Current value: ${value}`);
  }

  setHours(hours: number[]): void {
    if (this.startTime === hours[0] && this.bookingForm.get('endTime')?.value === hours[1]) {
      this.bookingForm.patchValue({
        startTime: null,
        endTime: null,
      });
    } else {
      this.bookingForm.patchValue({
        startTime: hours[0],
        endTime: hours[1],
      });
    }
  }

  private getWorkingSchedule(): void {
    this.workScheduleService.getSchedules()
      .pipe(takeUntil(this.unsubscribe$),
        tap((data) => {
          data.forEach((item) => {
            this.schedules[item.date] = item;
          });

          this.startHour.setValue(this.startWorkingDayTime);
        })
      ).subscribe();
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
    });
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

      this.bookingForm.get('duration')?.updateValueAndValidity();
    }
  }

}
