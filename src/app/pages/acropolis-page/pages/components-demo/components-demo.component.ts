import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePlaceholderComponent } from '../../../../shared';
import { CarouselComponent } from "../../../../shared";
import { CarouselItemDirective } from '../../../../shared';
import { ReviewCardComponent, ReviewData } from '../../../../shared';
import { SocialLink, SocialLinksComponent } from '../../../../shared';
import { LoadingIndicatorComponent } from '../../../../shared';

@Component({
  selector: 'app-pages-demo',
  templateUrl: './components-demo.component.html',
  styleUrls: ['./components-demo.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ImagePlaceholderComponent,
    CarouselComponent,
    CarouselItemDirective,
    ReviewCardComponent,
    SocialLinksComponent,
    LoadingIndicatorComponent
  ]
})
export class ComponentsDemoComponent {
  demoLoading = false;

  icons = [
    'architecture',
    'events',
    'dining',
    'gym',
    'kids',
    'connect',
    'shopping',
    'location',
    'phone',
    'email',
    'clock',
    'calendar',
    'info',
    'user',
    'star',
    'quote'
  ];

  customSocialLinks: SocialLink[] = [
    {
      platform: 'instagram',
      url: 'https://instagram.com',
      icon: 'instagram',
      label: 'Follow us on Instagram'
    },
    {
      platform: 'facebook',
      url: 'https://facebook.com',
      icon: 'facebook',
      label: 'Like us on Facebook'
    },
    {
      platform: 'twitter',
      url: 'https://twitter.com',
      icon: 'twitter',
      label: 'Follow us on Twitter'
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com',
      icon: 'linkedin',
      label: 'Connect on LinkedIn'
    }
  ];

  reviews: ReviewData[] = [
    {
      id: '1',
      name: 'Maria Thompson',
      rating: 5,
      date: 'June 15, 2024',
      content: 'The Acropolis Park is a beautiful place to relax and enjoy the day. The staff is friendly and helpful. The food is delicious and the atmosphere is wonderful.',
      service: 'Restaurant Visit'
    },
    {
      id: '2',
      name: 'John Davis',
      rating: 4,
      date: 'May 20, 2024',
      content: 'Great place for family gatherings! We celebrated my daughter\'s birthday here and everything was perfect. The only small issue was the parking.',
      service: 'Event Space'
    },
    {
      id: '3',
      name: 'Sarah Wilson',
      rating: 5,
      date: 'April 12, 2024',
      content: 'The architecture and design of this park is simply stunning. I spent hours just walking around and enjoying the beautiful surroundings.',
      service: 'Day Visit'
    },
    {
      id: '4',
      name: 'Robert Johnson',
      rating: 5,
      date: 'March 5, 2024',
      content: 'As a fitness enthusiast, I love the gym facilities at Acropolis Park. The equipment is top-notch and always well-maintained.',
      service: 'Gym Membership'
    },
    {
      id: '5',
      name: 'Emily Brown',
      rating: 4,
      date: 'February 18, 2024',
      content: 'My kids absolutely love the children\'s area. It\'s safe, clean, and has so many fun activities. We visit at least once a week!',
      service: 'Kids Zone'
    }
  ];

  slides = [
    'Slide 1 Content',
    'Slide 2 Content',
    'Slide 3 Content',
    'Slide 4 Content',
    'Slide 5 Content'
  ];

  currentSlide = 0;

  onSlideChange(index: number): void {
    this.currentSlide = index;
    console.log('Slide changed to', index);
  }
}
