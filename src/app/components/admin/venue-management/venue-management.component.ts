import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FirebaseService } from '../../../services/firebase.service';
import { Venue, VenueCategory } from '../../../models/task';
import { filter, finalize, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { BaseSDKHook } from '../../base.hook';
import { VenueFormModalComponent } from './venue-form-modal/venue-form-modal.component';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { VenueService } from '../../../services/server/venue.service';
import { CategoryService } from '../../../services/server/category.service';

@Component({
  selector: 'app-venue-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzTableModule,
    NzModalModule,
    NzMessageModule,
    NzUploadModule,
    NzSelectModule,
    NzInputNumberModule,
    NzTagModule,
    NzIconModule,
    NzPopconfirmModule,
    NzBadgeModule
  ],
  templateUrl: './venue-management.component.html',
  styleUrls: ['./venue-management.component.scss']
})
export class VenueManagementComponent extends BaseSDKHook implements OnInit, OnDestroy {
  venues: Venue[] = [];
  categories: VenueCategory[] = [];
  currentVenueId: string | null = null;

  private destroy$ = new Subject<void>();

  get currencySymbol(): string {
    return this.firebaseService.currencySymbol;
  }

  constructor(
    private firebaseService: FirebaseService,
    private message: NzMessageService,
    private modal: NzModalService,
    protected override cd: ChangeDetectorRef,
    private venueService: VenueService,
    private categoryService: CategoryService
  ) {
    super();
  }

  override ngOnInit(): void {
    this.loadCategories();
    this.initRefresh();
    this.refresh();
  }

  openModal(venue?: Venue): void {
    this.currentVenueId = venue?.id ?? null;
    const ref = this.modal.create({
      nzContent: VenueFormModalComponent,
      nzTitle: venue?.id ? 'Edit venue' : 'Add venue',
      nzData: {venue, categories: this.categories},
    });

    ref.afterClose
      .pipe(take(1))
      .subscribe(this.refresh);
  }

  deleteVenue(id: string): void {
    // this.isLoading = true;
    this.loadStart();
    this.venueService.deleteVenue(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((success) => {

        if (success) {
          this.message.success('Venue deleted successfully');
        } else {
          this.message.error('Failed to delete venue');
        }

        this.refresh();
      });
  }

  getCategoryName(categoryId: string | null = null): string {
    if (!categoryId) {
      return 'Uncategorized';
    }
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.title : 'Unknown Category';
  }

  protected getData = (): Observable<any> => {
    return this.venueService.getVenues()
      .pipe(takeUntil(this.destroy$),
        tap((venues) => {
          this.venues = venues;
          this.loadStop();
        }));
  };

  private loadCategories(): void {
    this.categoryService.getCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.cd.detectChanges();
        }
      });
  }
}
