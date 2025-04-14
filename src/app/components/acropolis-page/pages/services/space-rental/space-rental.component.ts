import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCategoriesComponent } from './service-categories/service-categories.component';
import { ServicesComponent } from './services/services.component';
import { BookingComponent } from './booking/booking.component';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';

@Component({
  selector: 'app-space-rental',
  standalone: true,
  imports: [CommonModule, ServiceCategoriesComponent, ServicesComponent, BookingComponent, BookingConfirmationComponent],
  templateUrl: './space-rental.component.html',
  styleUrls: ['./space-rental.component.scss']
})
export class SpaceRentalComponent {
  selectedCategoryId: string | null = null;
  selectedServiceId: string | null = null;
  bookingId: string | null = null;
}
