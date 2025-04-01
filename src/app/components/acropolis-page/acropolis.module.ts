import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AcropolisRoutingModule } from './acropolis-routing.module';
import { AcropolisLayoutComponent } from './layout/acropolis-layout.component';
import { AcropolisHeaderComponent } from './shared/header/header.component';
import { AcropolisFooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { ServiceDetailComponent } from './pages/services/service-detail/service-detail.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsComponent } from './pages/terms/terms.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AcropolisRoutingModule,
    
    // Standalone Components
    AcropolisLayoutComponent,
    AcropolisHeaderComponent,
    AcropolisFooterComponent,
    HomeComponent,
    AboutComponent,
    ServicesComponent,
    ServiceDetailComponent,
    ContactComponent,
    PrivacyPolicyComponent,
    TermsComponent
  ]
})
export class AcropolisModule { }