import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeHook } from '../../../unsubscribe.hook';
import { VenueService } from '../../../../services/server/venue.service';
import { distinctUntilChanged, take } from 'rxjs';
import { Dropdown, Venue } from '../../../../models/task';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-calendar-filter',
  standalone: true,
  imports: [CommonModule, NzSelectModule, ReactiveFormsModule, NzButtonModule, NzIconModule],
  templateUrl: './calendar-filter.component.html',
  styleUrls: ['./calendar-filter.component.scss']
})
export class CalendarFilterComponent extends UnsubscribeHook implements OnInit {
  filter!: FormGroup;
  venueOptions: Dropdown[] = []; // [{label: 'All Venues', value: null}];
  statuses = [
    // {label: 'All Statuses', value: null},
    {label: 'Pending', value: 'pending'},
    {label: 'Confirmed', value: 'confirmed'},
    {label: 'Paid', value: 'paid'},
    {label: 'Cancelled', value: 'cancelled'}
  ];

  @Output() filterChanged = new EventEmitter();
  @Output() venues = new EventEmitter<Venue[]>();
  @Output() openModal = new EventEmitter();
  @Output() refresh = new EventEmitter();

  constructor(private fb: FormBuilder, private venueService: VenueService) {
    super();
    this.filter = fb.group({
      venueId: null,
      statuses: [],
    });
  }

  ngOnInit(): void {
    this.loadVenues();
    this.filter.valueChanges
      .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
      .subscribe((value: any) => {
        this.filterChanged.emit(value);
      });
  }

  private loadVenues(): void {
    this.venueService.getVenues()
      .pipe(take(1))
      .subscribe((venues) => {
        venues.forEach(venue => {
          this.venueOptions.push({label: venue.title, value: venue.id});
        });

        this.venueOptions = [...this.venueOptions];
        this.venues.emit(venues);
      });
  }
}
