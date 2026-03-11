import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcropolisLayoutComponent } from '../layout/acropolis-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AcropolisLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./about/about.component').then(m => m.AboutComponent),
        data: {title: 'About | Acropolis'}
      },
      {
        path: 'services',
        children: [
          {
            path: 'grill',
            loadComponent: () => import('./services/grill/grill.component').then(m => m.GrillComponent),
            data: {title: 'Grill | Acropolis'}
          },
          {
            path: 'cafe',
            loadComponent: () => import('./services/cafe/cafe.component').then(m => m.CafeComponent),
            data: {title: 'Cafe | Acropolis'}
          },
          {
            path: 'connect',
            loadComponent: () => import('./services/connect/connect.component').then(m => m.ConnectComponent),
            data: {title: 'Connect | Acropolis'}
          },
          {
            path: 'kids',
            loadComponent: () => import('./services/kids/kids.component').then(m => m.KidsComponent),
            data: {title: 'Kids | Acropolis'}
          },
          {
            path: 'gym',
            loadComponent: () => import('./services/gym/gym.component').then(m => m.GymComponent),
            data: {title: 'Gym | Acropolis'}
          },
          {
            path: 'shopping',
            loadComponent: () => import('./services/shopping/shopping.component').then(m => m.ShoppingComponent),
            data: {title: 'Shopping | Acropolis'}
          },
        ]
      },
      {
        path: 'contact',
        loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent),
        data: {title: 'Contact | Acropolis'}
      },
      {
        path: 'privacy-policy',
        loadComponent: () => import('./privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent),
        data: {title: 'Privacy Policy | Acropolis'}
      },
      {
        path: 'terms',
        loadComponent: () => import('./terms/terms.component').then(m => m.TermsComponent),
        data: {title: 'Terms | Acropolis'}
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
export class AcropolisRoutingModule {
}
