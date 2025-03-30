import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VenueCategory } from '../../../models/task';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-service-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './service-categories.component.html',
  styleUrls: ['./service-categories.component.scss']
})
export class ServiceCategoriesComponent implements OnInit {
  categories: VenueCategory[] = [];
  
  constructor(
    private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.firebaseService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }
}
