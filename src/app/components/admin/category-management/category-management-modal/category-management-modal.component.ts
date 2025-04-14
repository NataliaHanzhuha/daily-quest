import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { map, Observable } from 'rxjs';
import { VenueCategory } from '../../../../models/task';
import { UploadImageService } from '../../../../services/server/upload-image.service';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-category-management-modal',
  standalone: true,
  imports: [CommonModule,
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
    NzEmptyModule, NzIconModule],
  templateUrl: './category-management-modal.component.html',
  styleUrls: ['./category-management-modal.component.scss']
})
export class CategoryManagementModalComponent implements OnInit {
  categoryForm: FormGroup;
  imageUrl: string | null = null;
  uploadProgress = 0;
  isUploading = false;
  currentCategoryId: string | null = null;

  private innerCategory: VenueCategory | null = null;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private ref: NzModalRef,
    private uploadImageService: UploadImageService
  ) {
    this.innerCategory = ref.getConfig().nzData?.category ?? null;

    this.categoryForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    if (this.innerCategory?.id) {
      this.currentCategoryId = this.innerCategory.id;
      this.categoryForm.patchValue({
        title: this.innerCategory.title,
        description: this.innerCategory.description
      });
      this.imageUrl = this.innerCategory.imageUrl ?? null;
    }
  }

  onCancel(data: VenueCategory | null = null): void {
    this.ref.close(data);
  }

  onSave(): void {
    this.onCancel({
      title: this.categoryForm?.get('title')?.value ?? this.innerCategory?.title ?? null,
      description: this.categoryForm?.get('description')?.value ?? this.innerCategory?.description ?? null,
      id: this.innerCategory?.id || null,
      imageUrl: this.imageUrl
    });
  }

  beforeUpload = (file: NzUploadFile): Observable<boolean> => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      this.message.error('You can only upload JPG/PNG files!');
      return new Observable(observer => observer.next(false));
    }

    const isLt2M = (file.size || 0) / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.message.error('Image must be smaller than 2MB!');
      return new Observable(observer => observer.next(false));
    }

    this.isUploading = true;

    return this.uploadImageService.uploadImage(file as any, 'category').pipe(
      map(url => {
        this.imageUrl = url;
        this.categoryForm.patchValue({imageUrl: url});
        this.isUploading = false;
        return false; // Prevent default upload behavior
      })
    );
  };

}
