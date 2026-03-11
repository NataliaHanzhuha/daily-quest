import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/acropolis-routing.module').then(m => m.AcropolisRoutingModule),
    data: {animation: 'HomePage'}
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
})
export class AppRoutingModule {
}
