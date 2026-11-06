import { Component, Input } from '@angular/core';

import { MenuItem } from '../../models/task';

@Component({
    selector: 'app-menu-items',
    imports: [],
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss']
})
export class MenuItemsComponent {
  @Input() list: MenuItem[] = [];
  @Input() headerTitle: string = '';
  @Input() headerDetails: string = '';
  @Input() img: string = '';

  get currencySymbol(): string {
    return '₦';
  }
}
