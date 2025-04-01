import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseServiceComponent } from '../base-service/base-service.component';
import { servicesData } from '../service.model';
import { ImagePlaceholderComponent } from '../../../../../components/shared/image-placeholder/image-placeholder.component';
import { CarouselComponent } from '../../../../../components/shared/carousel/carousel.component';
import { CarouselItemDirective } from '../../../../../components/shared/carousel/carousel-item.directive';

@Component({
  selector: 'app-space-rental',
  templateUrl: './space-rental.component.html',
  styleUrls: ['./space-rental.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    ImagePlaceholderComponent,
    CarouselComponent,
    CarouselItemDirective
  ]
})
export class SpaceRentalComponent extends BaseServiceComponent implements OnInit {
  override serviceId: string = 'space-rental';

  constructor() {
    super();
  }

  override ngOnInit(): void {
    this.service = servicesData.find(s => s.id === this.serviceId)!;
  }
}