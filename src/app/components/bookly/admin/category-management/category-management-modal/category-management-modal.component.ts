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
import { FirebaseService } from '../../../../../services/firebase.service';
import { finalize, Subscription } from 'rxjs';
import { VenueCategory } from '../../../../../models/task';

@Component({
  selector: 'app-category-management-modal',
  standalone: true,
  imports: [   CommonModule,
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
    NzEmptyModule],
  templateUrl: './category-management-modal.component.html',
  styleUrls: ['./category-management-modal.component.scss']
})
export class CategoryManagementModalComponent implements OnInit {
  categoryForm: FormGroup;
  imageUrl: string | null = null;
  uploadProgress = 0;
  isUploading = false;
  fileList: NzUploadFile[] = [];
  currentCategoryId: string | null = null;

  private innerCategory: VenueCategory | null = null;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private message: NzMessageService,
    private ref: NzModalRef,
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
      if (this.imageUrl) {
        this.fileList = [{
          uid: '-1',
          name: 'current-image.jpg',
          status: 'done',
          url: this.imageUrl
        }];
      }

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
    })
  }


  // Custom upload handler for Firebase Storage
  customUpload = (item: any): Subscription => {
    const file = item.file as File;
    this.isUploading = true;

    return this.firebaseService.uploadCategoryImage(file).pipe(
      finalize(() => {
        this.isUploading = false;
        this.uploadProgress = 0;
      })
    ).subscribe({
      next: (url: string) => {
        this.imageUrl = url;
        item.onSuccess();
      },
      error: (err) => {
        this.message.error('Upload failed');
        item.onError(err);
      }
    });
  }

  // Handle file change for nz-upload
  handleFileChange(info: any): void {
    if (info.file.status === 'uploading') {
      this.isUploading = true;
      return;
    }

    if (info.file.status === 'done') {
      this.isUploading = false;
      this.message.success(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.isUploading = false;
      this.message.error(`${info.file.name} upload failed`);
    }

    this.fileList = info.fileList.slice(-1); // Keep only the latest file
  }
}
