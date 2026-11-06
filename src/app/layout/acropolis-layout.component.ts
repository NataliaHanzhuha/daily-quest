import { Component, Inject, DOCUMENT, ChangeDetectionStrategy } from '@angular/core';

import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { AcropolisHeaderComponent } from '../shared/header/header.component';
import { AcropolisFooterComponent } from '../shared/footer/footer.component';
import { Meta, Title } from '@angular/platform-browser';
import { filter, mergeMap } from 'rxjs';
import { map } from 'rxjs/operators';

const SITE_URL = 'https://acropolispark.com';
const DEFAULT_TITLE = 'Acropolis Park | Events, Dining & Recreation in Abuja';
const DEFAULT_DESCRIPTION = 'A Modern Revival of Greek Grandeur — Your One-Stop Destination for Events, Recreation, and Community Living';

@Component({
    selector: 'app-acropolis-layout',
    templateUrl: './acropolis-layout.component.html',
    styleUrls: ['./acropolis-layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterModule, AcropolisHeaderComponent, AcropolisFooterComponent]
})
export class AcropolisLayoutComponent {
  constructor(
    private router: Router,
    private titleService: Title,
    private meta: Meta,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      const title = data['title'] || DEFAULT_TITLE;
      const description = data['description'] || DEFAULT_DESCRIPTION;
      const url = SITE_URL + this.router.url.split(/[?#]/)[0];

      this.titleService.setTitle(title);
      this.meta.updateTag({name: 'description', content: description});
      this.meta.updateTag({property: 'og:title', content: title});
      this.meta.updateTag({property: 'og:description', content: description});
      this.meta.updateTag({property: 'og:url', content: url});
      this.setCanonical(url);
    });
  }

  private setCanonical(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
