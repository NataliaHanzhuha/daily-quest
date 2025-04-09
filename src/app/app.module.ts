import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { bearerTokenInterceptor } from './services/token.interseptor';
import { RouterModule } from '@angular/router';

// Custom Components & Services
import { LoadingIndicatorComponent } from './components/shared/loading-indicator/loading-indicator.component';
import { LoadingService } from './services/loading.service';

// Ng-Zorro
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';

// Services
import { FirebaseService } from './services/firebase.service';
import { StripeService } from './services/stripe.service';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { ResponsiveDirective } from './components/responsive.directive';
import { provideNgxStripe } from 'ngx-stripe';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    ResponsiveDirective,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    LoadingIndicatorComponent,

    // Ng-Zorro modules
    NzLayoutModule,
    NzMenuModule,
    NzButtonModule,
    NzIconModule,
    NzCardModule,
    NzStepsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzInputNumberModule,
    NzCheckboxModule,
    NzResultModule,
    NzTableModule,
    NzTabsModule,
    NzModalModule,
    NzUploadModule,
    NzMessageModule,
    NzSpinModule,
    NzTagModule,
    NzBadgeModule,
    NzDividerModule,
    NzEmptyModule,
    NzPopconfirmModule,
    NzAlertModule,
    NzDescriptionsModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(),
    provideNgxStripe(environment.stripe.publicKey),
    {provide: NZ_I18N, useValue: en_US},
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initAuth,
    //   deps: [AuthService],
    //   multi: true,
    // },
    provideHttpClient(withInterceptors([bearerTokenInterceptor])),
    FirebaseService,
    StripeService,
    LoadingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
