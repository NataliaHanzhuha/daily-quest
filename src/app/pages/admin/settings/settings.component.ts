import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CategoryManagementComponent } from '../category-management/category-management.component';
import { VenueManagementComponent } from '../venue-management/venue-management.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { WorkScheduleComponent } from '../work-schedule/work-schedule.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, NzTabsModule, CategoryManagementComponent, VenueManagementComponent, UserManagementComponent, WorkScheduleComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

}
