import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarouselComponent } from '../../../../../components/shared/carousel/carousel.component';
import { CarouselItemDirective } from '../../../../../components/shared/carousel/carousel-item.directive';
import { MenuItem } from '../../../../../models/task';
import { MenuItemsComponent } from '../../../shared/menu-items/menu-items.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-grill',
  templateUrl: './grill.component.html',
  styleUrls: ['./grill.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenuItemsComponent,
    NzIconModule
  ],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({transform: 'translateY(100%)', opacity: 0}),
        animate('1000ms ease-out', style({transform: 'translateY(0)', opacity: 1}))
      ])
    ])
  ]
})
export class GrillComponent {
  schedule = '1pm-10pm, delivery till 6pm';
  tels = ['+24509014249093', '+24508033909678'];
  appetizers: MenuItem[] = [
    {
      name: 'Cheesy Garlic Bread',
      description: 'Red onion marmelade, garlic foccacia bread, grilled figs',
      price: 2000
    },
    {
      name: 'Cheesy Garlic Bread',
      description: 'Red onion marmelade, garlic foccacia bread, grilled figs',
      price: 2000
    },
    {
      name: 'Cheesy Garlic Bread',
      description: 'Red onion marmelade, garlic foccacia bread, grilled figs, Red onion marmelade, garlic foccacia bread, grilled figs',
      price: 2000
    },
    {
      name: 'Cheesy Garlic Bread',
      description: 'Red onion marmelade, garlic foccacia bread, grilled figs',
      price: 2000
    },
  ];
}
