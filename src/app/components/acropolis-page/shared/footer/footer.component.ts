import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SocialLinksComponent } from '../../../shared';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-acropolis-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, SocialLinksComponent, NzIconModule, NzBadgeModule, NzDropDownModule, NzTypographyModule]
})
export class AcropolisFooterComponent {
  currentYear = new Date().getFullYear();
  isServicesDropdownOpen = false;
  services = [
    { name: 'Space Rental', route: '/acropolis/services/space-rental' },
    { name: 'Grill', route: '/acropolis/services/grill' },
    { name: 'Foods', route: '/acropolis/services/cafe' },
    { name: 'Kids', route: '/acropolis/services/kids' },
    { name: 'Shopping', route: '/acropolis/services/shopping' },
    { name: 'Connect', route: '/acropolis/services/connect' },
    { name: 'Gym', route: '/acropolis/services/gym' },
  ];
  notReadyServices = ['Gym', 'Connect'];

}
