import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-kids',
  templateUrl: './kids.component.html',
  styleUrls: ['./kids.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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
export class KidsComponent {

}
