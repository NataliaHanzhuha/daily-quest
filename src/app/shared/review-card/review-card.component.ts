import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePlaceholderComponent } from '../image-placeholder/image-placeholder.component';

export interface ReviewData {
  id: string;
  name: string;
  rating: number;
  date?: string;
  content: string;
  avatar?: string;
  service?: string;
}

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss'],
  standalone: true,
  imports: [CommonModule, ImagePlaceholderComponent]
})
export class ReviewCardComponent {
  @Input() review!: ReviewData;
  @Input() cardStyle: 'default' | 'minimal' | 'featured' = 'default';
  @Input() showAvatar = true;
  @Input() showQuotes = true;

  get ratingArray(): number[] {
    return Array(5).fill(0).map((_, i) => i < this.review.rating ? 1 : 0);
  }

  get avatarInitial(): string {
    return this.review?.name?.charAt(0) || 'A';
  }
}
