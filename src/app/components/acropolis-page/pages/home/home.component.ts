import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { ImagePlaceholderComponent } from '../../../shared';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { animate, style, transition, trigger } from '@angular/animations';
import { TestimonialsComponent } from '../../shared/testimonials/testimonials.component';

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

interface Testimonial {
  text: string;
  author: string;
  rating: number;
}

interface Venue {
  name: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NzCarouselModule,
    ImagePlaceholderComponent,
    NzIconModule,
    NgOptimizedImage,
    NzToolTipModule,
    TestimonialsComponent
  ],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({transform: 'translateY(100%)', opacity: 0}),
        animate('1000ms ease-out', style({transform: 'translateY(0)', opacity: 1}))
      ])
    ])
  ]
})
export class HomeComponent {
  faqs: FAQ[] = [
    {
      question: 'What types of events can be hosted at Acropolis Park?',
      answer: 'Acropolis Park is perfect for a wide range of events including weddings, corporate meetings, private parties, product launches, exhibitions, and more. Our versatile spaces can be customized to suit your specific needs.',
      isOpen: false
    },
    {
      question: 'How far in advance should I book my event?',
      answer: 'We recommend booking at least 3-6 months in advance for large events such as weddings. For smaller events, 1-2 months notice is usually sufficient, but availability may vary depending on the season.',
      isOpen: false
    },
    {
      question: 'Do you provide catering services?',
      answer: 'Yes, we offer full-service catering with a variety of menu options to suit different tastes and dietary requirements. Our culinary team can create custom menus for your event upon request.',
      isOpen: false
    },
    {
      question: 'What are your operating hours?',
      answer: 'Our venue is open from 9:00 AM to 10:00 PM daily. Event hours can be extended upon request with additional charges.',
      isOpen: false
    }
  ];
  venues: Venue[] = [
    {
      name: 'Grand Hall',
      description: 'Our largest venue, perfect for weddings and large corporate events. Features elegant decor and state-of-the-art facilities.',
      image: '/assets/images/acropolis-home-hero.png'
    },
    {
      name: 'Garden Pavilion',
      description: 'An outdoor venue surrounded by lush greenery, ideal for ceremonies and cocktail receptions.',
      image: '/assets/images/acropolis-home-hero.png'
    },
    {
      name: 'Executive Suite',
      description: 'A sophisticated space for business meetings, training sessions, and small corporate gatherings.',
      image: '/assets/images/acropolis-home-hero.png'
    }
  ];

  constructor(private router: Router) {
  }

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  bookNow(): void {
    // Navigate to contact page for booking
    this.router.navigate(['/acropolis/contact']);
  }
}
