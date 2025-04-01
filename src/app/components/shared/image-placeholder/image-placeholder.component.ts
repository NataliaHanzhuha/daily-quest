import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-image-placeholder',
  templateUrl: './image-placeholder.component.html',
  styleUrls: ['./image-placeholder.component.scss'],
  standalone: true,
  imports: [CommonModule, NgOptimizedImage]
})
export class ImagePlaceholderComponent implements AfterViewInit, OnChanges {
  @ViewChild('imageContainer') imageContainer!: ElementRef;
  
  @Input() image: string = ''; // New input for direct image URL
  @Input() icon: string = '';
  @Input() size: 'small' | 'medium' | 'large' | 'custom' = 'medium';
  @Input() width: string = ''; // Custom width
  @Input() height: string = ''; // Custom height
  @Input() bgColor: string = '';
  @Input() iconColor: string = '';
  @Input() borderRadius: string = '';
  @Input() text: string = '';
  @Input() fontSize: string = '';
  @Input() fontWeight: string = '';
  @Input() objectFit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' = 'cover';
  @Input() alt: string = '';
  @Input() loading: 'eager' | 'lazy' = 'lazy';
  @Input() priority: boolean = false; // For high-priority images above the fold
  
  imageLoaded: boolean = false;
  imageError: boolean = false;
  containerWidth: number = 0;
  containerHeight: number = 0;

  // Map for icon paths
  private iconMap: { [key: string]: string } = {
    'architecture': '/assets/images/icons/architecture.svg',
    'events': '/assets/images/icons/events.svg',
    'dining': '/assets/images/icons/dining.svg',
    'gym': '/assets/images/icons/gym.svg',
    'kids': '/assets/images/icons/kids.svg',
    'connect': '/assets/images/icons/connect.svg',
    'shopping': '/assets/images/icons/shopping.svg',
    'location': '/assets/images/icons/location.svg',
    'phone': '/assets/images/icons/phone.svg',
    'email': '/assets/images/icons/email.svg',
    'clock': '/assets/images/icons/clock.svg',
    'calendar': '/assets/images/icons/calendar.svg',
    'info': '/assets/images/icons/info.svg',
    'user': '/assets/images/icons/user.svg',
    'star': '/assets/images/icons/star.svg',
    'quote': '/assets/images/icons/quote.svg'
  };

  ngAfterViewInit(): void {
    this.updateContainerDimensions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['image'] || changes['size'] || changes['width'] || changes['height']) && this.imageContainer) {
      setTimeout(() => this.updateContainerDimensions(), 0);
    }
  }

  updateContainerDimensions(): void {
    if (this.imageContainer) {
      this.containerWidth = this.imageContainer.nativeElement.offsetWidth;
      this.containerHeight = this.imageContainer.nativeElement.offsetHeight;
    }
  }

  onImageLoad(): void {
    this.imageLoaded = true;
    this.imageError = false;
  }

  onImageError(): void {
    this.imageError = true;
    this.imageLoaded = false;
  }

  get sizeClass(): string {
    return `placeholder-${this.size}`;
  }

  get styles(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};
    
    if (this.bgColor) {
      styles['background-color'] = this.bgColor;
    }
    
    if (this.borderRadius) {
      styles['border-radius'] = this.borderRadius;
    }

    if (this.size === 'custom') {
      if (this.width) {
        styles['width'] = this.width;
      }
      if (this.height) {
        styles['height'] = this.height;
      }
    }
    
    return styles;
  }

  get textStyles(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};
    
    if (this.fontSize) {
      styles['font-size'] = this.fontSize;
    }
    
    if (this.fontWeight) {
      styles['font-weight'] = this.fontWeight;
    }
    
    if (this.iconColor) {
      styles['color'] = this.iconColor;
    }
    
    return styles;
  }

  get iconPath(): string {
    return this.iconMap[this.icon] || '';
  }

  get hasImage(): boolean {
    return !!this.image && !this.imageError;
  }

  get hasIcon(): boolean {
    return !!this.icon && !!this.iconMap[this.icon];
  }

  get showPlaceholder(): boolean {
    return !this.hasImage || !this.imageLoaded;
  }

  get imageAlt(): string {
    return this.alt || this.text || 'Image';
  }

  // Fallback letter for when no icon or image is available
  get fallbackLetter(): string {
    if (this.text) {
      return this.text.charAt(0).toUpperCase();
    }
    return this.icon ? this.icon.charAt(0).toUpperCase() : 'A';
  }
}