import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VenueCategory } from '../../../models/task';
import { CategoryService } from '../../../services/category.service';
import { finalize, take } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-service-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NzSpinModule],
  templateUrl: './service-categories.component.html',
  styleUrls: ['./service-categories.component.scss']
})
export class ServiceCategoriesComponent implements OnInit {
  @Input() selectedCategoryId: string | null = null;
  @Output() selectedCategoryIdChanged = new EventEmitter<string | null>();
  loading = false;
  categories: VenueCategory[] = [];

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories()
      .pipe(take(1), finalize(() => this.loading = false))
      .subscribe(categories => {
        this.categories = categories;
      });
  }
}
