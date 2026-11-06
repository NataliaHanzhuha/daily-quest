import { Component, ChangeDetectionStrategy } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MenuItem } from '../../../models/task';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { animate, style, transition, trigger } from '@angular/animations';
import { MenuItemsComponent } from '../../../shared/menu-item/menu-item.component';

@Component({
    selector: 'app-grill',
    templateUrl: './grill.component.html',
    styleUrls: ['./grill.component.scss'],
    imports: [
    RouterModule,
    MenuItemsComponent,
    NzIconModule
],
    changeDetection: ChangeDetectionStrategy.Eager,
    animations: [
        trigger('slideIn', [
            transition(':enter', [
                style({ transform: 'translateY(100%)', opacity: 0 }),
                animate('1000ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
            ])
        ])
    ]
})
export class GrillComponent {
  schedule = '1pm-10pm, delivery till 6pm';
  tels = ['+24509014249093', '+24508033909678'];
  appetizers: MenuItem[] = [];
}
