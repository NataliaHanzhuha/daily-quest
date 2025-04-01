import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeamMember {
  name: string;
  position: string;
  bio: string;
  image: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AboutComponent {
  teamMembers: TeamMember[] = [
    {
      name: 'John Smith',
      position: 'CEO & Founder',
      bio: 'With over 20 years of experience in hospitality and event management, John founded Acropolis Park with a vision to create a unique space that combines Greek-inspired architecture with modern amenities.',
      image: '/assets/images/acropolis/team-1.jpg'
    },
    {
      name: 'Sarah Johnson',
      position: 'Events Director',
      bio: 'Sarah brings her passion for creating memorable experiences to every event at Acropolis Park. She oversees all aspects of event planning and execution to ensure every detail is perfect.',
      image: '/assets/images/acropolis/team-2.jpg'
    },
    {
      name: 'Michael Chen',
      position: 'Culinary Director',
      bio: `Chef Michael blends international flavors with local ingredients to create exceptional dining experiences. His innovative approach to cuisine has made Acropolis Park's restaurants a destination for food lovers.`,
      image: '/assets/images/acropolis/team-3.jpg'
    }
  ];
}
