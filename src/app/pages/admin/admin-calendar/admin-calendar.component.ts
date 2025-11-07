import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter, finalize, Subject, take, tap } from 'rxjs';
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
import { EventBooking, Venue, WorkSchedule } from '../../../models/task';

// Import the booking details modal component
import { BookingDetailsModalComponent } from './booking-details-modal/booking-details-modal.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { TimeService } from '../../../services/time.service';
import { EventBookingService } from '../../../services/server/event-booking.service';
import { WorkScheduleService } from '../../../services/server/work-shedule.service';
import { CalendarFilterComponent } from './calendar-filter/calendar-filter.component';
import { StatusColorPipe } from './status-color.pipe';
import { NzTableModule } from 'ng-zorro-antd/table';
import { VenueNamePipe } from './venue-name.pipe';

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
    NzTypographyModule,
    CalendarFilterComponent,
    StatusColorPipe,
    NzTableModule,
    VenueNamePipe
  ],
  templateUrl: './admin-calendar.component.html',
  styleUrls: ['./admin-calendar.component.scss']
})
export class AdminCalendarComponent implements OnInit, OnDestroy {
  bookings: EventBooking[] = [];
  venues: { [id: string]: Venue } = {};
  isLoading = false;
  calendarOptions!: CalendarOptions;
  statuses = [
    {label: 'All', value: null},
    {label: 'Pending', value: 'pending'},
    {label: 'Confirmed', value: 'confirmed'},
    {label: 'Paid', value: 'paid'},
    {label: 'Cancelled', value: 'cancelled'}
  ];
  currentEvents = signal<EventApi[]>([]);
  private filter: any = {
    ...this.timeService.getCurrentWeekRange(),
    statuses: [],
    venueId: null,
  };
  private destroy$ = new Subject<void>();
  private schedules: { [key: number]: WorkSchedule } = {};

  constructor(
    private message: NzMessageService,
    private modalService: NzModalService,
    private timeService: TimeService,
    private eventBookingService: EventBookingService,
    private workScheduleService: WorkScheduleService,
    private cd: ChangeDetectorRef
  ) {
    this.initCalendarOptions();
  }

  ngOnInit(): void {
    this.getWorkingSchedule();

    this.filter = {
      ...this.filter,
      ...this.timeService.getCurrentWeekRange()
    };
    this.loadBookings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setVenues(venues: Venue[]): void {
    venues.forEach((venue: Venue) => {
      this.venues[venue.id!] = venue;
    });

    this.cd.detectChanges();
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const startTime = this.timeService.getHour(selectInfo.startStr);
    const endTime = this.timeService.getHour(selectInfo.end);

    const booking = {
      venueId: 'null',
      date: this.timeService.getDate(selectInfo.startStr),
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
    // const calendarApi = selectInfo.view.calendar;
  }

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


  applyFilters(data: {
    venueId: string | null,
    statuses: string[]
  }): void {
    this.filter = {
      ...this.filter,
      ...this.timeService.getCurrentWeekRange(),
      ...data
    };
    this.loadBookings();
  }

  // Methods for confirming and cancelling bookings moved to BookingDetailsModalComponent

  showBookingDetails(booking?: EventBooking): void {
    const venueName = booking?.id ? this.venues[booking!.venueId]?.title : 'Unknown Venue';

    const modalRef = this.modalService.create({
      nzTitle: 'Booking Details',
      nzContent: BookingDetailsModalComponent,
      nzWidth: 750,
      nzData: {booking, venueName, color: this.venues[booking!.venueId]?.color ?? '#000'},
      nzFooter: null
    });

    modalRef.afterClose.pipe(take(1), filter(Boolean))
      .subscribe(() => {
        this.filter = {
          ...this.filter,
          ...this.timeService.getCurrentWeekRange()
        };
        this.loadBookings();
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
              daysOfWeek: [item.date],
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
        left: 'prev, next today',
        center: 'title',
        right: 'timeGridWeek'
        // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
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
      slotDuration: '00:60:01',
      allDaySlot: false,
      eventStartEditable: false, // disable drag&drop if false
      datesSet: () => {
        // console.log('Calendar navigated to new view');
        // console.log('Start:', arg.startStr, 'End:', arg.endStr);
        // this.loadBookings(this.timeService.getDate(arg.startStr), this.timeService.getDate(arg.endStr),);
      }
    };
  }

  loadBookings(): void {
    this.isLoading = true;
    const {from, to, venueId, statuses} = this.filter;
    this.eventBookingService.filteredBookingForCalendar(from, to, venueId, statuses)
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
      .subscribe((bookings) => {
        this.bookings = bookings.filter((booking: EventBooking) => {
          return booking.status !== 'cancelled';
        });
        this.setBookingToCalendar(this.bookings);
        this.isLoading = false;
      });
  }

  private setBookingToCalendar(bookings: EventBooking[]): void {
    this.calendarOptions.events = bookings.map((booking) => {
      const date = this.timeService.getDate(booking.date);
      const start: any = date + 'T' + booking.startTime + ':00:00';
      const end: any = date + 'T' + booking.endTime + ':00:00';

      return {
        id: booking.id,
        title: booking?.venueId,
        start, end,
        color: '#fefefe',
        textColor: '#222',
        extendedProps: {...booking}
      };
    });

    console.log(this.bookings, this.calendarOptions.events);
  }
}
