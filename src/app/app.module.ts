import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { bearerTokenInterceptor } from './services/token.interseptor';
import { RouterModule } from '@angular/router';

// Custom Components & Services
import { LoadingIndicatorComponent } from './components/shared/loading-indicator/loading-indicator.component';

// Ng-Zorro
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';

// Services
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NgxStripeModule } from 'ngx-stripe';
registerLocaleData(en);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LoadingIndicatorComponent,
    HttpClientModule,
    NgxStripeModule.forRoot(environment.stripe.publicKey),
  ],
  providers: [
    provideClientHydration(),
    {provide: NZ_I18N, useValue: en_US},
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initAuth,
    //   deps: [AuthService],
    //   multi: true,
    // },
    provideHttpClient(withInterceptors([bearerTokenInterceptor])),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
