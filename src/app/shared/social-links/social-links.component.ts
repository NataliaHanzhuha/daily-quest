import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  label: string;
  custom: boolean;
}

@Component({
    selector: 'app-social-links',
    templateUrl: './social-links.component.html',
    styleUrls: ['./social-links.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
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
      label: 'Instagram',
      custom: false
    },
    {
      platform: 'facebook',
      url: 'https://www.facebook.com/share/1U1VorfqJP/',
      icon: 'facebook',
      label: 'Facebook',
      custom: true
    },
    {
      platform: 'x',
      url: 'https://x.com/acropolisabuja',
      icon: 'twitter',
      label: 'X',
      custom: true
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
