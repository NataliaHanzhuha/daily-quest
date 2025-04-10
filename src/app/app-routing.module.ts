import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, loginGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then((c) => c.LoginComponent),
    canActivate: [loginGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/bookly/admin/admin.component').then((c) => c.AdminComponent),
    // canActivate: [authGuard]
  },
  {
    path: 'acropolis',
    loadChildren: () => import('./components/acropolis-page/acropolis-routing.module').then(m => m.AcropolisRoutingModule),
    data: { animation: 'HomePage' }
  },
  {
    path: '',
    redirectTo: 'acropolis',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
})
export class AppRoutingModule {
}
