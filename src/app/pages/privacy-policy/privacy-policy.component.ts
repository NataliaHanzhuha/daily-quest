import { Component, ChangeDetectionStrategy } from '@angular/core';

import { acropolisAddress, acropolisEmail, acropolisPhone } from '../../models/constants';

@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrls: ['./privacy-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: []
})
export class PrivacyPolicyComponent {
  lastUpdated = 'March 15, 2025';
  email = acropolisEmail;
  address = acropolisAddress;
  phone = acropolisPhone;
}
