import { Component, ChangeDetectionStrategy } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-connect',
    templateUrl: '../../../shared/coming-soon/coming-soon.component.html',
    styleUrls: ['../../../shared/coming-soon/coming-soon.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterModule]
})
export class ConnectComponent {
}
