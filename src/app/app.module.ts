import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import en from '@angular/common/locales/en';
import { registerLocaleData } from '@angular/common';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNzDateFnsAdapter } from 'ng-zorro-antd/core/time';


registerLocaleData(en);

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        RouterModule,
        BrowserAnimationsModule,
        AppRoutingModule], providers: [provideNzI18n(en_US), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideNzDateFnsAdapter()] })
export class AppModule {
}
