import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SocialLinksComponent } from '../index';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { PlatformService } from '../../services/platform.service';
import { bookingLink, notReadyServices, services } from 'src/app/models/constants';

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
  services = services;
  notReadyServices = notReadyServices;
  bookingLink = bookingLink;

  private readonly platformService = inject(PlatformService);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set((this.platformService.windowRef as Window)?.scrollY > 50);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
    // Close service-card dropdown when mobile menu is closed
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
