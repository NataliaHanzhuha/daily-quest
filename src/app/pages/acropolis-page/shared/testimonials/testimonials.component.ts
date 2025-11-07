import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent, CarouselItemDirective, ReviewCardComponent, ReviewData } from '../../../../shared';
import { PlatformService } from '../../../../services/platform.service';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
  standalone: true,
  imports: [CommonModule, CarouselComponent, CarouselItemDirective, ReviewCardComponent]
})
export class TestimonialsComponent {
  reviews: ReviewData[] = [
    {
      id: '-1',
      name: 'Sharon Ifeanyichukwu',
      rating: 5,
      date: 'October 2, 2025',
      content: 'Very aesthetic environment',
      service: 'Customer',
      avatar: 'https://randomuser.me/api/portraits/women/13.jpg'
    },
    {
      id: '0',
      name: 'Prince Jasper',
      rating: 5,
      date: 'June 21, 2025',
      content: 'One of the best Party Park in APO Abuja.',
      service: 'Customer',
      avatar: 'https://randomuser.me/api/portraits/women/13.jpg'
    },
    {
      id: '1',
      name: 'Mr. Right',
      rating: 5,
      date: 'February 9, 2025',
      content: 'It\'s a very Good Place For Picnics 🏺🥹😎😎🏺 …',
      service: 'Customer',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: '2',
      name: 'MT Mars',
      rating: 5,
      date: 'June 15, 2024',
      content: 'Beautiful park, you can also have a view of the different angles of Apo neighbourhood. It has various spot for meetings and other events. Clean toilet, I hope they have more than one tho.',
      service: 'Customer',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: '3',
      name: 'Njoku Viola',
      rating: 4,
      date: 'May 20, 2024',
      content: 'The park is nice and the environment is very calm and peaceful. My friend actually used this place for her birthday picnic, and I loved the entire environment, plus it\'s also neat.',
      service: 'Customer',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: '4',
      name: 'Fatshionista',
      rating: 5,
      date: 'April 12, 2024',
      content: 'I love this place . It\'s so calm and co . Beautiful aesthetic. Reminds me of greece . The stone walls and beautiful green fields . Totally recommend for a picnic , party and even a wedding ceremony.',
      service: 'Customer',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    {
      id: '5',
      name: 'Grand View Photography',
      rating: 5,
      date: 'March 5, 2024',
      content: 'Love the architecture of the place, what’s the policy of doing a photoshoot here with camera, I am thinking of creating something amazing in the space this month.',
      service: 'Customer',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    {
      id: '6',
      name: 'Great Gweke',
      rating: 4,
      date: 'February 18, 2024',
      content: 'Going up to Acropolis park you can already feel you’re ascending up a hill as and see things from a higher elevation which is beautiful with the sunset also has an event hall food spots well kept green grass..Acropolis is amazing!',
      service: 'Customer',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
    },
  ];

  constructor(private platform: PlatformService) {
  }

  // Prince Jasper
  // 5 months ago
  // One of the best Party Park in APO Abuja
  //
  // MT Mars
  //
  // 8 months ago
  // It's a very Good Place For Picnics 🏺🥹😎😎🏺 …

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
