import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SocialLinksComponent } from '../../../../shared';
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
  isMobileMenuOpen = signal(false);
  isServicesDropdownOpen = signal(false);
  isScrolled = signal(false);

  // Services submenu items
  services = [
    {name: 'Space Rental', route: '/services/space-rental'},
    {name: 'Grill', route: '/services/grill'},
    {name: 'Foods', route: '/services/cafe'},
    {name: 'Kids', route: '/services/kids'},
    {name: 'Shopping', route: '/services/shopping'},
    {name: 'Connect', route: '/services/connect'},
    {name: 'Gym', route: '/services/gym'},
  ];

  notReadyServices = ['Gym', 'Connect', 'Space Rental'];

  constructor(private platformService: PlatformService) {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set((this.platformService.windowRef as Window)?.scrollY > 50);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
    // Close services dropdown when mobile menu is closed
    if (!this.isMobileMenuOpen()) {
      this.isServicesDropdownOpen.set(false);
    }
  }

  toggleServicesDropdown() {
    this.isServicesDropdownOpen.update(v => !v);

  }

  closeMenus() {
    this.isMobileMenuOpen.set(false);
    this.isServicesDropdownOpen.set(false);
  }
}
