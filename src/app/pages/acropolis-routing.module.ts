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
        data: {
          title: 'About Us | Acropolis Park',
          description: 'Learn about Acropolis Park in Apo District, Abuja: a Greek-inspired recreational destination for families, events and community.'
        }
      },
      {
        path: 'services',
        children: [
          {
            path: 'grill',
            loadComponent: () => import('./services/grill/grill.component').then(m => m.GrillComponent),
            data: {
              title: 'Grill | Acropolis Park',
              description: 'Grilled favourites and sides at Acropolis Grill in Acropolis Park, Abuja. See the menu, prices and opening hours.'
            }
          },
          {
            path: 'cafe',
            loadComponent: () => import('./services/cafe/cafe.component').then(m => m.CafeComponent),
            data: {
              title: 'Foods & Café | Acropolis Park',
              description: 'Pasta, burgers, shawarmas, salads and coffee at the Acropolis Café in Acropolis Park, Abuja. View the full menu and prices.'
            }
          },
          {
            path: 'connect',
            loadComponent: () => import('./services/connect/connect.component').then(m => m.ConnectComponent),
            data: {
              title: 'Connect | Acropolis Park',
              description: 'Acropolis e-Connect at Acropolis Park, Abuja. Coming soon.'
            }
          },
          {
            path: 'kids',
            loadComponent: () => import('./services/kids/kids.component').then(m => m.KidsComponent),
            data: {
              title: 'Kids Playground | Acropolis Park',
              description: 'A safe, fun playground for children at Acropolis Park, Abuja. Plan a family day out or a children\'s party.'
            }
          },
          {
            path: 'gym',
            loadComponent: () => import('./services/gym/gym.component').then(m => m.GymComponent),
            data: {
              title: 'Gym | Acropolis Park',
              description: 'Fitness facilities at Acropolis Park, Abuja. Coming soon.'
            }
          },
          {
            path: 'shopping',
            loadComponent: () => import('./services/shopping/shopping.component').then(m => m.ShoppingComponent),
            data: {
              title: 'Shopping | Acropolis Park',
              description: 'Shops and retail spaces inside Acropolis Park, Abuja.'
            }
          },
        ]
      },
      {
        path: 'contact',
        loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent),
        data: {
          title: 'Contact Us | Acropolis Park',
          description: 'Contact Acropolis Park in Apo District, Abuja. Call, email or send an enquiry about events, dining and bookings.'
        }
      },
      {
        path: 'privacy-policy',
        loadComponent: () => import('./privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent),
        data: {
          title: 'Privacy Policy | Acropolis Park',
          description: 'How Acropolis Park collects, uses and protects your personal information.'
        }
      },
      {
        path: 'terms',
        loadComponent: () => import('./terms/terms.component').then(m => m.TermsComponent),
        data: {
          title: 'Terms of Use | Acropolis Park',
          description: 'Terms of use for the Acropolis Park website and services.'
        }
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
