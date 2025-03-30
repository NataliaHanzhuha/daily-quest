import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';

// Ng-Zorro Modules
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';

// Services and Models
import { FirebaseService } from '../../../../../services/firebase.service';
import { Dropdown, Venue, VenueCategory } from '../../../../../models/task';

@Component({
  selector: 'app-venue-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzInputNumberModule,
    NzTagModule,
    NzUploadModule,
    NzIconModule,
    // NzColorPickerModule,
  ],
  templateUrl: './venue-form-modal.component.html',
  styleUrls: ['./venue-form-modal.component.scss']
})
export class VenueFormModalComponent implements OnInit {
  categories: Dropdown[] = [];
  venueForm!: FormGroup;
  isLoading = false;
  imageUrl: string | null = null;
  isUploading = false;
  uploadProgress = 0;
  amenitiesInput = '';
  amenitiesList: string[] = [];
  private innerVenue: Venue | null = null;
  get currencySymbol(): string {
    return this.firebaseService.currencySymbol;
  }
  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private message: NzMessageService,
    private modalRef: NzModalRef
  ) {
    this.innerVenue = this.modalRef.getConfig().nzData?.venue;
    this.categories = this.modalRef.getConfig().nzData?.categories
      ?.map((cat: VenueCategory) => {
        return {label: cat.title, value: cat.id};
      });
    this.categories.unshift({label: 'Uncategorized', value: null});
    this.createForm();
  }

  ngOnInit(): void {
    this.patchForm();
  }

  handleCancel(): void {
    this.modalRef.close(null);
  }

  hourlyRateFormatter = (value: number): string => {
    return `${this.currencySymbol} ${value}`;
  };

  hourlyRateParser = (value: string): string => {
    return value.replace(`${this.currencySymbol} `, '');
  };

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

    return this.firebaseService.uploadVenueImage(file as any).pipe(
      map(url => {
        this.imageUrl = url;
        this.venueForm.patchValue({imageUrl: url});
        this.isUploading = false;
        return false; // Prevent default upload behavior
      })
    );
  };

  addAmenity(): void {
    if (this.amenitiesInput.trim()) {
      this.amenitiesList = [...this.amenitiesList, this.amenitiesInput.trim()];
      this.amenitiesInput = '';
    }
  }

  removeAmenity(amenity: string): void {
    this.amenitiesList = this.amenitiesList.filter(a => a !== amenity);
  }

  handleOk(): void {
    if (this.venueForm.invalid) {
      Object.values(this.venueForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
      return;
    }

    const venueData = {
      ...this.venueForm.value,
      amenities: this.amenitiesList
    } as any;

    if (this.innerVenue?.id) {
      // Update existing venue
      this.firebaseService.updateVenue({...venueData, id: this.innerVenue?.id})
        .subscribe((venue: Venue) => {
          this.message.success('Venue updated successfully');
          this.modalRef.close(venue);
        });
    } else {
      // Add new venue
      this.firebaseService.addVenue(venueData)
        .subscribe((venue: Venue) => {
          this.message.success('Venue added successfully');
          this.modalRef.close(venue);
        });
    }
  }

  private patchForm(): void {
    if (this.innerVenue?.id) {
      this.venueForm.patchValue({
        title: this.innerVenue.title,
        description: this.innerVenue.description,
        categoryId: this.innerVenue.categoryId,
        capacity: this.innerVenue.capacity,
        hourlyRate: this.innerVenue.hourlyRate,
        minHours: this.innerVenue.minHours,
        maxHours: this.innerVenue.maxHours,
        imageUrl: this.innerVenue.imageUrl,
        color: this.innerVenue.color,
        paddingBeforeMinutes: this.innerVenue?.paddingBeforeMinutes ?? 0,
        paddingAfterMinutes: this.innerVenue?.paddingAfterMinutes ?? 0,
      });
      this.imageUrl = this.innerVenue.imageUrl ?? null;
      this.amenitiesList = [...this.innerVenue.amenities];
    }
  }

  private createForm(): void {
    this.venueForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      categoryId: ['', [Validators.required]],
      capacity: [50, [Validators.required, Validators.min(1)]],
      hourlyRate: [100, [Validators.required, Validators.min(1)]],
      minHours: [2, [Validators.required, Validators.min(1)]],
      maxHours: [8, [Validators.required, Validators.min(1)]],
      imageUrl: ['', Validators.required],
      color: [''],
      paddingBeforeMinutes: [0],
      paddingAfterMinutes: [0],
    });
  }
}
