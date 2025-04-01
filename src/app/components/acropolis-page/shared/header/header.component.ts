import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SocialLinksComponent } from '../../../shared/social-links/social-links.component';

@Component({
  selector: 'app-acropolis-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NzIconModule, SocialLinksComponent]
})
export class AcropolisHeaderComponent {
  isMobileMenuOpen = false;
  isServicesDropdownOpen = false;
  isScrolled = false;

  // Services submenu items
  services = [
    { name: 'Space Rental', route: '/acropolis/services/space-rental' },
    { name: 'Grill', route: '/acropolis/services/grill' },
    { name: 'Cafe', route: '/acropolis/services/cafe' },
    { name: 'Connect', route: '/acropolis/services/connect' },
    { name: 'Kids', route: '/acropolis/services/kids' },
    { name: 'Gym', route: '/acropolis/services/gym' },
    { name: 'Shopping', route: '/acropolis/services/shopping' }
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
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
