import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  // isAdmin$: Observable<boolean>;

  constructor(private userService: UserService, private message: NzMessageService) {
    // this.isAdmin$ = this.userService.hasRole('admin');
  }

  ngOnInit(): void {
    // this.userService.getUsers().subscribe(users => {
    //   this.users = users;
    // });
  }

  deleteUser(uid: string): void {
    // this.userService.deleteUser(uid).then(() => {
    //   this.message.success('User deleted successfully!');
    // });
  }
}
