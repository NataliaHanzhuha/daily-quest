import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { acropolisAddress, acropolisEmail, acropolisPhone } from '../../../../models/constants';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PrivacyPolicyComponent {
  lastUpdated = 'March 15, 2025';
  email = acropolisEmail;
  address = acropolisAddress;
  phone = acropolisPhone;
}
