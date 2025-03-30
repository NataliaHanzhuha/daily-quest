// components/work-schedule/work-schedule.component.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { WorkSchedule, WeekDay } from '../../../../models/task';
import { FirebaseService } from '../../../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { filter, Observable, takeUntil, tap } from 'rxjs';
import { BaseSDKHook } from '../../../base.hook';
import { WorkScheduleModalComponent } from './work-schedule-modal/work-schedule-modal.component';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-work-schedule',
  templateUrl: './work-schedule.component.html',
  styleUrls: ['./work-schedule.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzDatePickerModule,
    NzTableModule,
    NzDividerModule,
    NzPopconfirmModule,
    NzButtonModule,
    NzIconModule,
  ],
})
export class WorkScheduleComponent extends BaseSDKHook implements OnInit {
  schedules: WorkSchedule[] = [];
  weekDay = WeekDay

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

  openModal(schedule?: WorkSchedule): void {
    const ref = this.modal.create({
      nzContent: WorkScheduleModalComponent,
      nzTitle: schedule?.id ? 'Edit day' : 'Add day',
      nzData: {schedule},
    });

    ref.afterClose
      .pipe(takeUntil(this.unsubscribe$), filter(Boolean))
      .subscribe(this.refresh);
  }

  deleteSchedule(id: string): void {
    this.firebaseService.deleteSchedule(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.message.success('Schedule deleted successfully');
        this.refresh();
      });
  }

  protected getData = (): Observable<WorkSchedule[]> => {
    return this.firebaseService.getSchedules()
      .pipe(takeUntil(this.unsubscribe$),
        tap((data) => {
          this.schedules = data.sort((a, b) => a.date - b.date);
          this.loadStop();
        })
      );
  };
}

