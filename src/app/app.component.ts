import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fadeAnimation } from './animation';

@Component({
  selector: 'app-root',
  template: `
	  <div class="app-container"
	       [@routeAnimations]="prepareRoute(outlet)">
		  <router-outlet #outlet="outlet"></router-outlet>
	  </div>
  `,
  standalone: false,
  animations: [fadeAnimation]
})
export class AppComponent {
  user: any = null;
  title: any;

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] ?? '';
  }
}
