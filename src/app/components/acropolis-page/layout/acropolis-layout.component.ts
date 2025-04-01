import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AcropolisHeaderComponent } from '../shared/header/header.component';
import { AcropolisFooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-acropolis-layout',
  templateUrl: './acropolis-layout.component.html',
  styleUrls: ['./acropolis-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, AcropolisHeaderComponent, AcropolisFooterComponent]
})
export class AcropolisLayoutComponent {
}