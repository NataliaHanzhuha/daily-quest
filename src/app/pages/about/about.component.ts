import { Component, ChangeDetectionStrategy } from '@angular/core';

import { animate, style, transition, trigger } from '@angular/animations';

interface TeamMember {
  name: string;
  position: string;
  bio: string;
  image: string;
}

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    imports: [],
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
export class AboutComponent {
}
