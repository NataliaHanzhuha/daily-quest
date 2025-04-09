import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VenueCategory } from '../../../models/task';
import { FirebaseService } from '../../../services/firebase.service';
import { CategoryService } from '../../../services/category.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-service-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './service-categories.component.html',
  styleUrls: ['./service-categories.component.scss']
})
export class ServiceCategoriesComponent implements OnInit {
  @Input() selectedCategoryId: string | null = null;
  @Output() selectedCategoryIdChanged = new EventEmitter<string | null>();

  categories: VenueCategory[] = [];

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.getCategories()
      .pipe(take(1))
      .subscribe(categories => {
        this.categories = categories;
      });
  }
}
