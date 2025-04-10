import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from '../../../shared';
import { CarouselItemDirective } from '../../../shared';
import { ReviewCardComponent, ReviewData } from '../../../shared';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PlatformService } from '../../../../services/platform.service';
@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
  standalone: true,
  imports: [CommonModule, CarouselComponent, CarouselItemDirective, ReviewCardComponent]
})
export class TestimonialsComponent {
  constructor(private platform: PlatformService) {
  }
  reviews: ReviewData[] = [
    {
      id: '1',
      name: 'Maria Thompson',
      rating: 5,
      date: 'June 15, 2024',
      content: 'The Acropolis Park is a beautiful place to relax and enjoy the day. The staff is friendly and helpful. The food is delicious and the atmosphere is wonderful. I would highly recommend this place to anyone visiting the area.',
      service: 'Customer',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: '2',
      name: 'John Davis',
      rating: 4,
      date: 'May 20, 2024',
      content: 'Great place for family gatherings! We celebrated my daughter\'s birthday here and everything was perfect. The only small issue was the parking, which can get crowded on weekends.',
      service: 'Customer',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: '3',
      name: 'Sarah Wilson',
      rating: 5,
      date: 'April 12, 2024',
      content: 'The architecture and design of this park is simply stunning. I spent hours just walking around and enjoying the beautiful surroundings. The integration of nature and modern design elements is masterful.',
      service: 'Customer',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    {
      id: '4',
      name: 'Robert Johnson',
      rating: 5,
      date: 'March 5, 2024',
      content: 'As a fitness enthusiast, I love the gym facilities at Acropolis Park. The equipment is top-notch and always well-maintained. The trainers are knowledgeable and supportive.',
      service: 'Customer',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    {
      id: '5',
      name: 'Emily Brown',
      rating: 4,
      date: 'February 18, 2024',
      content: 'My kids absolutely love the children\'s area. It\'s safe, clean, and has so many fun activities. We visit at least once a week and they never get bored!',
      service: 'Customer',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
    }
  ];
  
  // Responsive settings
  carouselItemsPerView(a: any, b: any, c: any): any {
      const width = (this.platform.windowRef as Window)?.innerWidth;
      if (width < 768) {
        return a;
      } else if (width < 1200) {
        return b;
      } else {
        return c;
      }
  }
}
