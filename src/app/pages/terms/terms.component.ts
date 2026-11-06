import { Component, ChangeDetectionStrategy } from '@angular/core';

import { acropolisAddress, acropolisEmail, acropolisPhone } from '../../models/constants';

@Component({
    selector: 'app-terms',
    templateUrl: './terms.component.html',
    styleUrls: ['./terms.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: []
})
export class TermsComponent {
  lastUpdated = 'March 15, 2025';
  email = acropolisEmail;
  address = acropolisAddress;
  phone = acropolisPhone;
}
