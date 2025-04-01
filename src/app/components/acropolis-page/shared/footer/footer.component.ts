import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SocialLinksComponent } from '../../../shared/social-links/social-links.component';

@Component({
  selector: 'app-acropolis-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NzIconModule, SocialLinksComponent]
})
export class AcropolisFooterComponent {
  currentYear = new Date().getFullYear();
}
