import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

// Used only at build time to prerender static HTML for each route.
@NgModule({
  imports: [AppModule, ServerModule, NoopAnimationsModule],
  bootstrap: [AppComponent]
})
export class AppServerModule {
}
