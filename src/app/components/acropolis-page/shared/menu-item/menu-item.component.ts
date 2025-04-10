import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../../models/task';
import { FirebaseService } from '../../../../services/firebase.service';

@Component({
  selector: 'app-menu-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemsComponent {
  @Input() list: MenuItem[] = [];
  @Input() headerTitle: string = '';
  @Input() headerDetails: string = '';
  @Input() img: string = '';

  get currencySymbol(): string {
    return this.firebaseService.currencySymbol;
  }

  constructor(private firebaseService: FirebaseService) {
  }

}
