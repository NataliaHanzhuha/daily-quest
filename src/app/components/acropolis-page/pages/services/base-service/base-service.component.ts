import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceDetail } from '../service.model';
import { ImagePlaceholderComponent } from '../../../../../components/shared/image-placeholder/image-placeholder.component';
import { CarouselComponent } from '../../../../../components/shared/carousel/carousel.component';
import { CarouselItemDirective } from '../../../../../components/shared/carousel/carousel-item.directive';

@Component({
  selector: 'app-base-service',
  templateUrl: './base-service.component.html',
  styleUrls: ['./base-service.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    ImagePlaceholderComponent,
    CarouselComponent,
    CarouselItemDirective
  ]
})
export class BaseServiceComponent implements OnInit {
  @Input() serviceId: string = '';
  @Input() service!: ServiceDetail;

  constructor() {}

  ngOnInit(): void {
    if (!this.service && this.serviceId) {
      // Derived classes should populate this.service in their init logic
      console.warn('Service not initialized for serviceId:', this.serviceId);
    }
  }
}