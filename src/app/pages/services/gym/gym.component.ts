import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-gym',
    templateUrl: '../../../shared/coming-soon/coming-soon.component.html',
    styleUrls: ['../../../shared/coming-soon/coming-soon.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [CommonModule, RouterModule]
})
export class GymComponent {
}
