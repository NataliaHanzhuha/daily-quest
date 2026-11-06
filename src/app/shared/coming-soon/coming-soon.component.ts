import { Component } from '@angular/core';

import { animate, style, transition, trigger } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
    selector: 'app-coming-soon',
    templateUrl: './coming-soon.component.html',
    styleUrls: ['./coming-soon.component.scss'],
    imports: [BrowserAnimationsModule],
    animations: [
        trigger('slideIn', [
            transition(':enter', [
                style({ transform: 'translateY(100%)', opacity: 0 }),
                animate('1000ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
            ])
        ])
    ]
})
export class ComingSoonComponent {
}
