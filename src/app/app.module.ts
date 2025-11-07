import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { bearerTokenInterceptor } from './services/token.interseptor';
import { RouterModule } from '@angular/router';

// Custom Components & Services
import { LoadingIndicatorComponent } from './shared';

// Ng-Zorro
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
// Services
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NgxStripeModule } from 'ngx-stripe';
import { Angular4PaystackModule } from 'angular4-paystack';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

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
    Angular4PaystackModule.forRoot(environment.paystackPublickKey),
  ],
  providers: [
    {provide: NZ_I18N, useValue: en_US},
    {provide: NZ_ICONS, useValue: icons},
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
