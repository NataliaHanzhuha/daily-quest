import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-connect',
  templateUrl: '../../../shared/coming-soon/coming-soon.component.html',
  styleUrls: ['../../../shared/coming-soon/coming-soon.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ConnectComponent {
}
