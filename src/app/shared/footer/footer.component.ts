import { Component, ChangeDetectionStrategy } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SocialLinksComponent } from '../index';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { acropolisAddress, acropolisEmail, acropolisPhone, bookingLink, notReadyServices, services } from '../../models/constants';

@Component({
    selector: 'app-acropolis-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterModule, SocialLinksComponent, NzIconModule, NzBadgeModule, NzDropdownModule, NzTypographyModule]
})
export class AcropolisFooterComponent {
  currentYear = new Date().getFullYear();
  services = services;
  notReadyServices = notReadyServices;
  email = acropolisEmail;
  address = acropolisAddress;
  phone = acropolisPhone;
  protected readonly bookingLink = bookingLink;
}
