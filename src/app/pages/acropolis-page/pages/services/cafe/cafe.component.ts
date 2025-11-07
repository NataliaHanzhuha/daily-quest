import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MenuItem } from '../../../../../models/task';
import { animate, style, transition, trigger } from '@angular/animations';
import { MenuItemsComponent } from '../../../shared/menu-item/menu-item.component';

@Component({
  selector: 'app-cafe',
  templateUrl: './cafe.component.html',
  styleUrls: ['./cafe.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NzIconModule, MenuItemsComponent],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({transform: 'translateY(100%)', opacity: 0}),
        animate('1000ms ease-out', style({transform: 'translateY(0)', opacity: 1}))
      ])
    ])
  ]
})
export class CafeComponent {
  schedule = 'Monday-Saturday, 12pm-9pm';
  tel = '+24508052035515';
  appetizers: MenuItem[] = [
    {
      name: 'Penne Alfredo',
      description: 'Penne pasta in creamy white sauce with chicken breast',
      price: 4500
    },
    {
      name: 'Lasagna',
      description: 'Layers of pasta sheets with minced beef & cheese',
      price: 6500
    },
    {
      name: 'Spaghetti Bolognese',
      description: 'Spaghetti with minced beef sauce topped with grated parmesan cheese',
      price: 3800
    },
    {
      name: 'Chicken Penne Arabiata pasta',
      description: 'Penne pasta in tomato - basil sauce withchicken breast',
      price: 4000
    },
    {
      name: 'Creamy Chicken Tomato pasta',
      description: 'Pasta with chicken breast in tomato sauce & cream',
      price: 4500
    },
  ];
  sandwiches: MenuItem[] = [
    {
      name: 'Beef Burger',
      description: '',
      price: 3000
    },
    {
      name: 'Grilled Chicken Burger',
      description: '',
      price: 3000
    },
    {
      name: 'Cripy Chicken Burger',
      description: '',
      price: 3500
    },
    {
      name: 'Chicken Sandwich',
      description: '',
      price: 1200
    },
    {
      name: 'Philly Cheese Steak Sandwich',
      description: '',
      price: 2250
    },
  ];
  sandwichesDetails = 'Baguette bread with grilled beef and green bell peppers, toppled with BBQ sauce & mozzarella cheese';
  shawarmas: MenuItem[] = [
    {
      name: 'Beef Shawarma',
      description: '',
      price: 1500
    },
    {
      name: 'Bbq Shawarma',
      description: '',
      price: 2000
    },
    {
      name: 'Chicken Shawarma',
      description: '',
      price: 1500
    },
    {
      name: 'Jerk Shawarma',
      description: '',
      price: 2000
    },
    {
      name: 'Kofta Shawarma',
      description: '',
      price: 1500
    },
    {
      name: 'Mixed ( Chicken & Beef)',
      description: '',
      price: 2000
    },
  ];
  shawarmaDescription = 'Sausage N250, Cheese N 300, Extra Chicken/beef N 350';
  sides: MenuItem[] = [
    {
      name: 'Fries',
      description: '',
      price: 1500
    },
    {
      name: '1/4 Chicken',
      description: 'Plain, peppered, Gravy sauce',
      price: 1500
    },
    {
      name: 'Jellof Rice',
      description: '',
      price: 1000
    },
    {
      name: 'Fried Rice',
      description: '',
      price: 1000
    },
    {
      name: 'Steamed Herbed Rice',
      description: '',
      price: 1000
    },
  ];
  salads = [
    {
      name: 'Chicken Ceasar Salad',
      description: '',
      price: 3000
    },
    {
      name: 'Coleslaw',
      description: '',
      price: 500
    },
    {
      name: 'Tuna Salad',
      description: '',
      price: 3500
    },
    {
      name: 'Huse\'s Cafe Salad',
      description: 'Pchicken, vegetables, seasonal fruits in cream sauce with herbs',
      price: 3000
    },
  ];
  images: string[] = [
    '/assets/images/cafe-menu-pasta.png',
    '/assets/images/cafe-menu-rice.png',
    '/assets/images/cafe-menu-salad.png',
    '/assets/images/cafe-menu-sandwich.png',
    // '/assets/images/cafe-menu-jellof-rice.png',
  ];
}

