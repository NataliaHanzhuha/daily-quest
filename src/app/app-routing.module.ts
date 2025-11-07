import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((c) => c.LoginComponent),
    canMatch: [loginGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then((c) => c.AdminComponent),
    // canActivate: [authGuard]
  },
  {
    path: '',
    loadChildren: () => import('./pages/acropolis-page/acropolis-routing.module').then(m => m.AcropolisRoutingModule),
    data: {animation: 'HomePage'}
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // initialNavigation: 'enabledBlocking',
    scrollPositionRestoration: 'top',
  })],
})
export class AppRoutingModule {
}
