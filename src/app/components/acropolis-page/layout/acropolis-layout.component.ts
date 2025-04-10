import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { AcropolisHeaderComponent } from '../shared/header/header.component';
import { AcropolisFooterComponent } from '../shared/footer/footer.component';
import { Title, Meta } from '@angular/platform-browser';
import { filter, mergeMap } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-acropolis-layout',
  templateUrl: './acropolis-layout.component.html',
  styleUrls: ['./acropolis-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, AcropolisHeaderComponent, AcropolisFooterComponent]
})
export class AcropolisLayoutComponent {
  constructor(
    private router: Router,
    private titleService: Title,
    private meta: Meta,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      const title = data['title'] || 'Acropolis Park';
      this.titleService.setTitle(title);
      this.meta.updateTag({
        name: 'description',
        content: 'A Modern Revival of Greek Grandeur — Your One-Stop Destination for Events, Recreation, and Community Living'
      })
    });
  }
}
