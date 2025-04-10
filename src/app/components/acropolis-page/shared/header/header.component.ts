import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SocialLinksComponent } from '../../../shared/social-links/social-links.component';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { PlatformService } from '../../../../services/platform.service';

@Component({
  selector: 'app-acropolis-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NzIconModule, SocialLinksComponent, NzBadgeModule]
})
export class AcropolisHeaderComponent {
  isMobileMenuOpen = false;
  isServicesDropdownOpen = false;
  isScrolled = false;

  // Services submenu items
  services = [
    { name: 'Space Rental', route: '/services/space-rental' },
    { name: 'Grill', route: '/services/grill' },
    { name: 'Foods', route: '/services/cafe' },
    { name: 'Kids', route: '/services/kids' },
    { name: 'Shopping', route: '/services/shopping' },
    { name: 'Connect', route: '/services/connect' },
    { name: 'Gym', route: '/services/gym' },
  ];

  notReadyServices = ['Gym', 'Connect'];
constructor(private platformService: PlatformService) {
}
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = (this.platformService.windowRef as Window)?.scrollY > 50;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Close services dropdown when mobile menu is closed
    if (!this.isMobileMenuOpen) {
      this.isServicesDropdownOpen = false;
    }
  }

  toggleServicesDropdown() {
    this.isServicesDropdownOpen = !this.isServicesDropdownOpen;
  }

  closeMenus() {
    this.isMobileMenuOpen = false;
    this.isServicesDropdownOpen = false;
  }
}
