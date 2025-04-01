import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TermsComponent {
  lastUpdated = 'March 15, 2025';
}