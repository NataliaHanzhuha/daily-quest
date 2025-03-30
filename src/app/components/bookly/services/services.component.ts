import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Venue, VenueCategory } from '../../../models/task';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { FirebaseService } from '../../../services/firebase.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BookingComponent } from '../booking/booking.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NzTypographyModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  venues: Venue[] = [];
  category: VenueCategory | null = null;
  categoryId: string | null = null;

  get currencySymbol(): string {
    return this.firebaseService.currencySymbol;
  }

  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NzModalService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id');
      if (this.categoryId) {
        this.loadCategoryDetails(this.categoryId);
        this.loadVenues(this.categoryId);
      } else {
        // If no category ID is provided, load all venues
        this.loadAllVenues();
      }
    });
  }

  redirectToBooking(id: string): void {
    // const selectedVenue = this.venues.find((venue) => venue.id === id);
    // this.modalService.create({
    //   nzContent: BookingComponent,
    //   nzData: {id, venue: {...selectedVenue, categoryName: this.category?.title}},
    //   nzWidth: '100%',
    //   nzMaskClosable: false,
    //   nzClosable: false
    // });

    this.router.navigate([`/booking/${id}`]).then();
  }

  loadCategoryDetails(categoryId: string): void {
    this.firebaseService.getCategoryById(categoryId).subscribe(category => {
      this.category = category || null;
    });
  }

  loadVenues(categoryId: string): void {
    this.firebaseService.getVenuesByCategory(categoryId).subscribe(venues => {
      this.venues = venues;
    });
  }

  loadAllVenues(): void {
    this.firebaseService.getVenues().subscribe(venues => {
      this.venues = venues;
    });
  }
  
  // Format amenities list as comma-separated
  formatAmenities(amenities: string[]): string {
    return amenities.join(', ');
  }
}
