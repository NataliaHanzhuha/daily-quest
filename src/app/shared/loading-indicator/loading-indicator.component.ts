import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class LoadingIndicatorComponent {
  @Input() isLoading: boolean = false;
  @Input() fullScreen: boolean = false;
  @Input() showLogo: boolean = true;
  @Input() text: string = 'Loading...';
  @Input() overlay: boolean = true;
}