import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({providedIn: 'root'})
export class PlatformService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  get windowRef(): Window | undefined {
    return isPlatformBrowser(this.platformId) ? window : undefined;
  }
}
