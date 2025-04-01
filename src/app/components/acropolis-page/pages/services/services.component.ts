import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { servicesData } from './service.model';
import { ImagePlaceholderComponent } from '../../../../components/shared/image-placeholder/image-placeholder.component';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ImagePlaceholderComponent]
})
export class ServicesComponent {
  services = servicesData;
}
