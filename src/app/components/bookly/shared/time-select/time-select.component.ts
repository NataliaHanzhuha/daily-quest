import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { takeUntil } from 'rxjs/operators';
import { EventBooking } from '../../../../models/task';
import { FirebaseService } from '../../../../services/firebase.service';
import { UnsubscribeHook } from '../../../unsubscribe.hook';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-time-select',
  standalone: true,
  imports: [CommonModule, NzDividerModule, NzInputNumberModule, NzSelectModule, NzAlertModule, NzButtonModule, NzSpinModule],
  templateUrl: './time-select.component.html',
  styleUrls: ['./time-select.component.scss']
})
export class TimeSelectComponent extends UnsubscribeHook {
  // TODO: make it more simple
  @Input() startTime!: number;
  availableTimeSlots: number[][] = [];
  isLoading = false;
  private existingBookings: EventBooking[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private message: NzMessageService,

    ) {
    super();
  }

  setHours(hours: number[]): void {
    // if (this.startTime === hours[0] && this.bookingForm.get('endTime')?.value === hours[1]) {
    //   this.bookingForm.patchValue({
    //     startTime: null,
    //     endTime: null,
    //   });
    // } else {
    //   this.bookingForm.patchValue({
    //     startTime: hours[0],
    //     endTime: hours[1],
    //   });
    // }
  }

  private checkAvailability(): void {
    // if (!this.venue?.id || !this.selectedDate) {
    //   return;
    // }

    this.isLoading = true;
    // const date = this.bookingForm.get('date')?.value;
    // const startTime = this.formatTime(this.bookingForm.get('startTime')?.value);
    // const endTime = this.formatTime(this.bookingForm.get('endTime')?.value);

    // this.firebaseService.checkVenueAvailability(this.venue?.id, this.selectedDate)
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe({
    //     next: (isAvailable: EventBooking[]) => {
    //       this.isLoading = false;
    //       this.existingBookings = isAvailable;
    //       this.calculateTimeSlots();
    //     },
    //     error: (err) => {
    //       console.error('Error checking availability:', err);
    //       this.message.error('Failed to check availability. Please try again.');
    //       this.isLoading = false;
    //     }
    //   });
  }

  private calculateTimeSlots(): void {
    // const workStartHour = this.selectedStartTime
    //   ? this.selectedStartTime
    //   : this.startWorkingDayTime;
    //
    // const {paddingBeforeMinutes, paddingAfterMinutes} = this.venue;
    //
    // this.availableTimeSlots = this.timeService.findAvailableSlots(
    //   this.existingBookings, this.venue.id!, this.selectedDate!.toDateString(), workStartHour,
    //   this.endWorkingDayTime, this.selectedDuration * 60, paddingBeforeMinutes, paddingAfterMinutes);

    console.log(this.availableTimeSlots);
  }
}
