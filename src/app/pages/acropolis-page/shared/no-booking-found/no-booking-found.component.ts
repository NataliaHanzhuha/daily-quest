import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-booking-found',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzResultModule],
  template: `
		<nz-result
			nzStatus="error"
			nzTitle="Booking Not Found"
			nzSubTitle="Sorry, the booking you are looking for does not exist or has been removed.">
			<div nz-result-extra>
				<button nz-button
				        nzType="primary"
				        (click)="browseVenues()">Browse Venues
				</button>
			</div>
		</nz-result>
  `,
  styles: []
})
export class NoBookingFoundComponent {
  constructor(private router: Router) {
  }

  browseVenues(): void {
    this.router.navigate(['/']);
  }
}
