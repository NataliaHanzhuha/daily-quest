import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-social-links',
  templateUrl: './social-links.component.html',
  styleUrls: ['./social-links.component.scss'],
  standalone: true,
  imports: [CommonModule, NzIconModule]
})
export class SocialLinksComponent {
  @Input() displayMode: 'icons' | 'text' | 'both' = 'icons';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
  @Input() color: string = '';
  @Input() hoverColor: string = '';
  @Input() backgroundColor: string = '';
  @Input() borderRadius: string = '';
  @Input() customIcons: SocialLink[] = [];

  // Default social media links
  defaultSocialLinks: SocialLink[] = [
    {
      platform: 'instagram',
      url: 'https://www.instagram.com/theacropolispark/',
      icon: 'instagram',
      label: 'Instagram'
    },
    {
      platform: 'facebook',
      url: 'https://www.facebook.com/theacropolisapo/',
      icon: 'facebook',
      label: 'Facebook'
    },
    {
      platform: 'twitter',
      url: 'https://x.com/acropolisabuja/',
      icon: 'twitter',
      label: 'Twitter'
    }
  ];

  get socialLinks(): SocialLink[] {
    return this.customIcons.length > 0 ? this.customIcons : this.defaultSocialLinks;
  }

  get sizeClass(): string {
    return `size-${this.size}`;
  }

  get directionClass(): string {
    return `direction-${this.direction}`;
  }

  get containerStyle(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};

    if (this.backgroundColor) {
      styles['background-color'] = this.backgroundColor;
    }

    return styles;
  }

  get iconStyle(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};

    if (this.color) {
      styles['color'] = this.color;
    }

    if (this.borderRadius) {
      styles['border-radius'] = this.borderRadius;
    }

    return styles;
  }
}
