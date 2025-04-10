import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter, Subject, take, tap } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Ng-Zorro modules
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

// Services and Models
import { EventBooking, Venue, WorkSchedule } from '../../../../models/task';

// Import the booking details modal component
import { BookingDetailsModalComponent } from './booking-details-modal/booking-details-modal.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { TimeService } from '../../../../services/time.service';
import { EventBookingService } from '../../../../services/event-booking.service';
import { VenueService } from '../../../../services/venue.service';
import { WorkScheduleService } from '../../../../services/work-shedule.service';

@Component({
  selector: 'app-admin-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCalendarModule,
    NzBadgeModule,
    NzSpinModule,
    NzCardModule,
    NzModalModule,
    NzButtonModule,
    NzTagModule,
    NzMessageModule,
    NzSelectModule,
    NzEmptyModule,
    NzDividerModule,
    NzToolTipModule,
    NzPopoverModule,
    FullCalendarModule,
    NzTypographyModule
  ],
  templateUrl: './admin-calendar.component.html',
  styleUrls: ['./admin-calendar.component.scss']
})
export class AdminCalendarComponent implements OnInit, OnDestroy {
  bookings: EventBooking[] = [];
  venues: Map<string, Venue> = new Map();
  selectedDate: Date = new Date();
  isLoading = false;
  filteredBookings: EventBooking[] = [];
  selectedVenue: string | null = null;
  selectedStatus: string | null = null;
  calendarOptions!: CalendarOptions;
  statuses = [
    {label: 'All', value: null},
    {label: 'Pending', value: 'pending'},
    {label: 'Confirmed', value: 'confirmed'},
    {label: 'Paid', value: 'paid'},
    {label: 'Cancelled', value: 'cancelled'}
  ];
  currentEvents = signal<EventApi[]>([]);
  private destroy$ = new Subject<void>();
  private schedules: { [key: number]: WorkSchedule } = {};

  constructor(
    private message: NzMessageService,
    private modalService: NzModalService,
    private timeService: TimeService,
    private eventBookingService: EventBookingService,
    private venueService: VenueService,
    private workScheduleService: WorkScheduleService
  ) {
    this.initCalendarOptions();
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const startTime = this.timeService.getHour(selectInfo.startStr);
    const endTime = this.timeService.getHour(selectInfo.end);

    const booking = {
      venueId: 'null',
      date: this.timeService.getDate(selectInfo.start),
      startTime,
      endTime,
      duration: endTime - startTime,
      customerName: null,
      customerEmail: null,
      customerPhone: null,
      customerPhoneNumberPrefix: null,
      eventType: null,
      attendees: 0,
      status: 'pending',
      totalAmount: 0,
      userId: null,
      createdAt: new Date(),
      paymentDetails: null
    } as unknown;
    this.showBookingDetails(booking as EventBooking);
    // const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;
    console.log(selectInfo, calendarApi);
    // calendarApi.unselect(); // clear date selection
    //
    // if (title) {
    //   calendarApi.addEvent({
    //     id: Date.now().toString(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   });
    // }
  }

  // Make Array available in the template

  handleEventClick(clickInfo: EventClickArg) {
    console.log(clickInfo);
    const booking = clickInfo.event.id
      ? this.bookings.find(booking => booking.id === clickInfo.event.id)
      : {
        venueId: null,
        date: '',
        startTime: '',
        endTime: '',
        duration: 0,
        customerName: null,
        customerEmail: null,
        customerPhone: null,
        customerPhoneNumberPrefix: null,
        eventType: null,
        attendees: 0,
        status: 'pending',
        totalAmount: 0,
        userId: null,
        createdAt: new Date(),
        paymentDetails: null
      } as unknown;
    this.showBookingDetails(booking as EventBooking);
    // clickInfo.event.
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   // clickInfo.event.remove();
    // }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    // this.cd.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  ngOnInit(): void {
    this.getWorkingSchedule();
    this.loadVenues();
    let {from, to} = this.timeService.getCurrentWeekRange();
    this.loadBookings(from, to);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters(): void {
    this.filteredBookings = this.bookings.filter(booking => {
      let matchesVenue = true;
      let matchesStatus = true;

      if (this.selectedVenue) {
        matchesVenue = booking.venueId === this.selectedVenue;
      }

      if (this.selectedStatus) {
        matchesStatus = booking.status === this.selectedStatus;
      }

      return matchesVenue && matchesStatus;
    });
  }

  getVenueName(venueId: string): string {
    const venue = this.venues.get(venueId);
    return venue ? venue.title : 'Unknown Venue';
  }

  getBookingsForDate(date: Date): EventBooking[] {
    const dateString = date.toISOString().split('T')[0];
    return this.filteredBookings.filter(booking => {
      const bookingDate = typeof booking.date === 'string'
        ? new Date(booking?.date)?.toISOString()?.split('T')[0]
        : booking?.date?.toISOString()?.split('T')[0];
      return bookingDate === dateString;
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'confirmed':
        return '#52c41a';
      case 'paid':
        return '#b4befe';
      case 'cancelled':
        return '#f5222d';
      default:
        return '#faad14'; // pending
    }
  }

  onDateSelect(date: Date): void {
    this.selectedDate = date;
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) {
      return 'N/A';
    }

    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return parsedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(hour: string): string {
    // Convert 24-hour format to 12-hour format
    const ampm = +hour >= 12 ? 'PM' : 'AM';
    const hour12 = +hour % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  }

  // Methods for confirming and cancelling bookings moved to BookingDetailsModalComponent

  private showBookingDetails(booking: EventBooking): void {
    const venueName = booking?.id ? this.getVenueName(booking!.venueId) : 'Unknown Venue';

    const modalRef = this.modalService.create({
      nzTitle: 'Booking Details',
      nzContent: BookingDetailsModalComponent,
      nzWidth: 750,
      nzData: {booking, venueName, color: this.venues.get(booking!.venueId)?.color ?? '#000'},
      nzFooter: null
    });

    modalRef.afterClose.pipe(take(1), filter(Boolean))
      .subscribe(result => {
        let {from, to} = this.timeService.getCurrentWeekRange();

        this.loadBookings(from, to);
      });
  }

  private getWorkingSchedule(): void {
    this.workScheduleService.getSchedules()
      .pipe(
        takeUntil(this.destroy$),
        tap((data) => {
          const arr: any[] = [];
          data.forEach((item) => {
            this.schedules[item.date] = item;
            arr.push({
              daysOfWeek: [item.date], // Monday–Friday
              startTime: item.startTime + ':00',
              endTime: item.endTime + ':00'
            });
          });
          this.calendarOptions.businessHours = [...arr];
        })
      ).subscribe();
  }

  private initCalendarOptions(): void {
    this.calendarOptions = {
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
      ],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      initialView: 'timeGridWeek',
      weekends: true,
      editable: true,
      selectable: true,
      displayEventEnd: true,
      selectMirror: true,
      dayMaxEvents: true,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
      slotMinTime: '08:00:00',
      slotMaxTime: '22:00:00',
      datesSet: (arg) => {
        console.log('Calendar navigated to new view');
        console.log('Start:', arg.startStr, 'End:', arg.endStr);
        this.loadBookings(this.timeService.getDate(arg.startStr), this.timeService.getDate(arg.endStr),);
      }
    };
  }

  private loadVenues(): void {
    this.venueService.getVenues()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: venues => {
          venues.forEach(venue => this.venues.set(venue.id!, venue));
        },
        error: err => {
          console.error('Error loading venues:', err);
          this.message.error('Failed to load venues');
        }
      });
  }

  private loadBookings(from: any, to: any): void {
    this.isLoading = true;
    this.eventBookingService.filteredBookingForCalendar(from, to)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: bookings => {
          this.bookings = bookings.filter((booking: EventBooking) => {
            return booking.status !== 'cancelled';
          });
          this.calendarOptions.events = this.bookings.map((booking) => {
            const date = booking.dateString ?? this.timeService.getDate(booking.date);
            const start: any = date + 'T' + booking.startTime + ':00:00';
            const end: any = date + 'T' + booking.endTime + ':00:00';

            return {
              id: booking.id,
              title: this.venues.get(booking.venueId)?.title ?? booking?.venueId,
              start, end,
              color: '#fefefe',
              textColor: '#222',
              extendedProps: {...booking}
            };
          });

          console.log(this.bookings, this.calendarOptions.events);
          this.applyFilters();
          this.isLoading = false;
        },
        error: err => {
          console.error('Error loading bookings:', err);
          this.message.error('Failed to load bookings');
          this.isLoading = false;
        }
      });
  }
}
