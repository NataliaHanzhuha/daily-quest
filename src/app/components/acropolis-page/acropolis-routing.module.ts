import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcropolisLayoutComponent } from './layout/acropolis-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AcropolisLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent)
      },
      {
        path: 'services/space-rental',
        loadComponent: () => import('./pages/services/space-rental/space-rental.component').then(m => m.SpaceRentalComponent)
      },
      {
        path: 'services/grill',
        loadComponent: () => import('./pages/services/grill/grill.component').then(m => m.GrillComponent)
      },
      {
        path: 'services/cafe',
        loadComponent: () => import('./pages/services/cafe/cafe.component').then(m => m.CafeComponent)
      },
      {
        path: 'services/connect',
        loadComponent: () => import('./pages/services/connect/connect.component').then(m => m.ConnectComponent)
      },
      {
        path: 'services/kids',
        loadComponent: () => import('./pages/services/kids/kids.component').then(m => m.KidsComponent)
      },
      {
        path: 'services/gym',
        loadComponent: () => import('./pages/services/gym/gym.component').then(m => m.GymComponent)
      },
      {
        path: 'services/shopping',
        loadComponent: () => import('./pages/services/shopping/shopping.component').then(m => m.ShoppingComponent)
      },
      // Keep this as a fallback for any other service routes
      {
        path: 'services/:service',
        loadComponent: () => import('./pages/services/service-detail/service-detail.component').then(m => m.ServiceDetailComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'privacy-policy',
        loadComponent: () => import('./pages/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
      },
      {
        path: 'terms',
        loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent)
      },
      {
        path: 'components-demo',
        loadComponent: () => import('./pages/components-demo/components-demo.component').then(m => m.ComponentsDemoComponent)
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcropolisRoutingModule { }