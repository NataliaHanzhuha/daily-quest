import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from '../../../../services/firebase.service';
import { VenueCategory } from '../../../../models/task';
import { filter, Observable, tap } from 'rxjs';

// Ng-Zorro
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { CategoryManagementModalComponent } from './category-management-modal/category-management-modal.component';
import { takeUntil } from 'rxjs/operators';
import { BaseSDKHook } from '../../../base.hook';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzDividerModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzUploadModule,
    NzMessageModule,
    NzSpinModule,
    NzEmptyModule
  ],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryManagementComponent extends BaseSDKHook implements OnInit {
  categories: VenueCategory[] = [];
  isEditing = false;
  currentCategoryId: string | null = null;

  fileList: NzUploadFile[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private message: NzMessageService,
    private modal: NzModalService,
    protected override cd: ChangeDetectorRef,
  ) {
    super();
  }

  override ngOnInit(): void {
    this.initRefresh();
  }

  openModal(category?: VenueCategory): void {
    this.isEditing = !!category?.id;
    this.currentCategoryId = category?.id ?? null;
    const ref = this.modal.create({
      nzContent: CategoryManagementModalComponent,
      nzTitle: category?.id ? 'Edit category' : 'Add category',
      nzData: {category},
    });

    ref.afterClose
      .pipe(takeUntil(this.unsubscribe$), filter(Boolean))
      .subscribe(this.handleSubmit);
  }

  deleteCategory(id: string): void {
    this.loadStart();
    this.firebaseService.deleteCategory(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((success: boolean) => {
          if (success) {
            this.message.success('Category deleted successfully');
            this.refresh();
          } else {
            this.message.error('Failed to delete category');
            this.loadStart();
          }
        },
      );
  }

  protected getData = (): Observable<VenueCategory[]> => {
    this.loadStart();
    return this.firebaseService.getCategories()
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((categories: VenueCategory[]) => {
          this.categories = categories;
          this.loadStop();
        }));
  };

  private handleSubmit = (categoryData: VenueCategory): void => {
    this.loadStart();

    if (this.isEditing && this.currentCategoryId) {
      this.updateCategory({
        ...categoryData,
        id: this.currentCategoryId
      });
    } else {
      this.addCategory(categoryData);
    }
  };

  private updateCategory(category: VenueCategory): void {
    this.firebaseService.updateCategory(category)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((newCategory: VenueCategory | null) => {
          if (!newCategory) {
            this.loadStop();
          }
          this.message.success('Category updated successfully');
          this.refresh();
        }
      );
  }

  private addCategory(categoryData: Omit<VenueCategory, 'id'>): void {
    this.firebaseService.addCategory(categoryData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((newCategory: VenueCategory | null) => {
        if (!newCategory) {
          this.loadStop();
        }
        this.message.success('Category added successfully');
        this.refresh();
      });
  }

}
