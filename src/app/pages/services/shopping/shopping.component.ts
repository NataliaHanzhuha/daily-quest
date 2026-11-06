import { Component, ChangeDetectionStrategy } from '@angular/core';

import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-shopping',
    templateUrl: './shopping.component.html',
    styleUrls: ['./shopping.component.scss'],
    imports: [RouterModule, NzIconModule],
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
export class ShoppingComponent {

}
