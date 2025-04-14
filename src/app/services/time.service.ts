import { Injectable } from '@angular/core';
import { EventBooking } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  isSlotAvailable(
    existingBookings: EventBooking[],
    newBooking: EventBooking,
    paddingBeforeMinutes: number,
    paddingAfterMinutes: number
  ): boolean {
    const newStart = this.timeToMinutes(newBooking.startTime) - paddingBeforeMinutes;
    const newEnd = this.timeToMinutes(newBooking.endTime) + paddingAfterMinutes;

    for (const booking of existingBookings) {
      const existingStart = this.timeToMinutes(booking.startTime + ':00');
      const existingEnd = this.timeToMinutes(booking.endTime + ':00');

      if (
        (newStart >= existingStart && newStart < existingEnd) || // Overlaps start
        (newEnd > existingStart && newEnd <= existingEnd) || // Overlaps end
        (newStart <= existingStart && newEnd >= existingEnd) // Completely overlaps
      ) {
        return false; // Conflict found
      }
    }

    return true; // No conflicts
  }

  resetToMidnight(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  findAvailableSlots(
    existingBookings: EventBooking[],
    venueId: string,
    date: string,
    startHour: number,
    endHour: number,
    duration: number,
    paddingBeforeMinutes: number = 0,
    paddingAfterMinutes: number = 0
  ): number[][] {
    const availableSlots: number[][] = [];
    const openingMinutes = startHour * 60; // + paddingBeforeMinutes;
    const closingMinutes = endHour * 60;

    // you could not book slot for current day
    if (this.isToday(new Date(date))) {
      return availableSlots;
    }

    for (let time = openingMinutes; time + duration <= closingMinutes; time += 60) {
      const slotStart = this.minutesToTime(time);
      const slotEnd = this.minutesToTime(time + duration);

      const newBooking: any = {
        id: '',
        venueId,
        date,
        startTime: slotStart,
        endTime: slotEnd,
        duration: duration / 60,
      };

      const isSlotAvailable = this.isSlotAvailable(existingBookings, newBooking, paddingBeforeMinutes, paddingAfterMinutes);
      // console.log(isSlotAvailable, slotStart, slotEnd);
      if (isSlotAvailable) {
        availableSlots.push([+(slotStart.slice(0, -3)), +(slotEnd.slice(0, -3))]);
      }
    }

    return availableSlots;
  }

  getCurrentWeekRange(): { from: string, to: string } {
    const curr = new Date();

    // Get first day of week (Sunday = 0)
    const first = new Date(curr);
    first.setDate(curr.getDate() - curr.getDay());

    // Get last day (first + 6 days)
    const last = new Date(first);
    last.setDate(first.getDate() + 6);

    // Format to YYYY-MM-DD
    const format = (d: Date): string => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      from: format(first),
      to: format(last)
    };
  }

  getDate(datetime: Date | string | any, full: boolean = false): string {
    if (!datetime) {
      return datetime;
    }

    if (typeof datetime === 'string') {
      return datetime?.split('T')[0];
    }

    if (Object.prototype.toString.call(datetime) === '[object Date]') {
      const day = (datetime as unknown as Date).getDate();
      const month = (datetime as unknown as Date).getMonth();
      const year = (datetime as unknown as Date).getFullYear();

      return `${year}-${month}-${day}`;
    }

    const {seconds, nanoseconds} = datetime;
    const milliseconds = seconds * 1000 + nanoseconds / 1e6; // Convert to ms
    return full
      ? new Date(milliseconds)?.toISOString()
      : new Date(milliseconds)?.toISOString()?.split('T')[0]; // Convert to ISO format
  }

  getHour(datetime: Date | string): number {
    console.log(datetime,);
    if (typeof datetime === 'string') {
      return new Date(datetime).getHours();
    }
    return (datetime as unknown as Date).getHours();
  }

  private isToday(selectedDate: Date): boolean {
    const today = new Date();

    return selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear();
  }

  checkIfItSameDay(date1: any, date2: any): boolean {
    return this.getDate(date1) === this.getDate(date2);
  }

}
