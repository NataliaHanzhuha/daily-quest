import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dropdown, WorkSchedule, WeekDay } from '../../../../../models/task';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FirebaseService } from '../../../../../services/firebase.service';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { dropdownOptionsFromEnum } from '../../../../enum-to-dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'app-work-schedule-modal',
  standalone: true,
  imports: [
    CommonModule,
    NzFormModule,
    NzDatePickerModule,
    NzTimePickerModule,
    ReactiveFormsModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzInputNumberModule,
    NzModalModule,
  ],
  templateUrl: './work-schedule-modal.component.html',
  styleUrls: ['./work-schedule-modal.component.scss']
})
export class WorkScheduleModalComponent implements OnInit {
  schedule: WorkSchedule | null = null;
  scheduleForm!: FormGroup;
  weekDaysOptions: Dropdown[] = dropdownOptionsFromEnum(WeekDay);

  constructor(private fb: FormBuilder,
              private firebaseService: FirebaseService,
              private message: NzMessageService,
              private modalRef: NzModalRef,) {
    this.schedule = this.modalRef.getConfig().nzData?.schedule;
    this.initForm();
  }

  ngOnInit(): void {
  }

  submitForm(): void {
    if (this.scheduleForm.valid) {
      const formValue = this.scheduleForm.value;
      const schedule = {
        ...formValue,
        id: this.schedule?.id,
        createdAt: this.schedule?.createdAt || new Date(),
        updatedAt: new Date()
      };

      this.schedule?.id
        ? this.handleEditSubmit(schedule)
        : this.handleAddSubmit(schedule);
    } else {
      Object.values(this.scheduleForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  cancel(): void {
    this.modalRef.close();
  }

  private initForm(): void {
    this.scheduleForm = this.fb.group({
      date: [this.schedule?.date || null, [Validators.required]],
      startTime: [this.schedule?.startTime || null, [Validators.required]],
      endTime: [this.schedule?.endTime || null, [Validators.required]],
      // description: [this.schedule?.description || '', [Validators.required, Validators.maxLength(500)]]
    });
  }

  private handleAddSubmit(schedule: WorkSchedule): void {
    this.firebaseService.addSchedule(schedule).subscribe(() => {
      this.message.success('Schedule added successfully');
      this.modalRef.close(schedule);
    });
  }

  private handleEditSubmit(schedule: WorkSchedule): void {
    this.firebaseService.updateSchedule(schedule).subscribe(() => {
      this.message.success('Schedule updated successfully');
      this.modalRef.close(schedule);
    });
  }
}
