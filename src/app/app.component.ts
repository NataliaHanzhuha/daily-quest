import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  Event as RouterEvent,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet
} from '@angular/router';
import { LoadingService } from './services/loading.service';
import { Subscription } from 'rxjs';
import { fadeAnimation } from './animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading = false;
  user: any = null;
  title: any;
  private routerSubscription!: Subscription;
  private loadingSubscription!: Subscription;
  private loadingTimeout: any;

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private cd: ChangeDetectorRef,
    // private angularFireAuth: AngularFireAuth,
    // private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    // Subscribe to router events to track navigation
    this.routerSubscription = this.router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });

    // Subscribe to loading service
    this.loadingSubscription = this.loadingService.loading$.subscribe(isLoading => {
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] ?? '';
  }

  // Shows and hides the loading spinner during RouterEvent changes
  private navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      // Set a timeout for showing the spinner to avoid flicker for quick loads
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
      }

      this.loadingTimeout = setTimeout(() => {
        this.isLoading = true;
        this.cd.detectChanges();

        // this.loadingService.startLoading();
      }, 0); // Only show loading if navigation takes longer than 200ms
    }

    if (event instanceof NavigationEnd ||
      event instanceof NavigationCancel ||
      event instanceof NavigationError) {
      // Clear the timeout if navigation completes quickly
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = null;
      }

      // Add a short delay before hiding the spinner to ensure smooth transitions
      setTimeout(() => {
        this.isLoading = false;
        this.cd.detectChanges();
        // this.loadingService.stopLoading();
      }, 200);
    }
  }
}
