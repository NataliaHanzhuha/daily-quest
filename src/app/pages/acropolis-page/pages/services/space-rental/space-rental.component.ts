import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-space-rental',
  standalone: true,
  imports: [CommonModule],
  templateUrl: '../../../shared/coming-soon/coming-soon.component.html',
  styleUrls: ['../../../shared/coming-soon/coming-soon.component.scss'],
})
export class SpaceRentalComponent {
  selectedCategoryId: string | null = null;
  selectedServiceId: string | null = null;
  bookingId: string | null = null;
}
