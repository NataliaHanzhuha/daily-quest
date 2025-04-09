import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Venue, VenueCategory } from '../../../models/task';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { FirebaseService } from '../../../services/firebase.service';
import { BookingComponent } from '../booking/booking.component';
import { CategoryService } from '../../../services/category.service';
import { UnsubscribeHook } from '../../unsubscribe.hook';
import { takeUntil } from 'rxjs/operators';
import { VenueService } from '../../../services/venue.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NzTypographyModule, BookingComponent],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent extends UnsubscribeHook implements OnInit {
  venues: Venue[] = [];
  category: VenueCategory | null = null;
  @Input() categoryId: string | null = null;
  @Output() categoryIdChanged = new EventEmitter<null>();
  @Input() selectedService: string | null = null;
  @Output() selectedServiceChanged = new EventEmitter<string | null>();

  constructor(private firebaseService: FirebaseService,
              private venueService: VenueService,
              private categoryService: CategoryService) {
    super();
  }

  get currencySymbol(): string {
    return this.firebaseService.currencySymbol;
  }

  ngOnInit(): void {
    if (this.categoryId) {
      this.loadCategoryDetails(this.categoryId);
      this.loadVenues(this.categoryId);
    }
  }

  redirectToBooking(id: string): void {
    this.selectedService = id;
    this.selectedServiceChanged.emit(id);
  }

  formatAmenities(amenities: string[]): string {
    return amenities.join(', ');
  }

  private loadCategoryDetails(categoryId: string): void {
    this.categoryService.getCategoryById(categoryId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(category => {
      this.category = category || null;
    });
  }

  private loadVenues(categoryId: string): void {
    this.venueService.getVenueByFilter(categoryId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(venues => {
      this.venues = venues;
    });
  }
}
