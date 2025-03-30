import { AppComponent } from './app/app.component';
// import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';

export { renderModule } from '@angular/platform-server';

bootstrapApplication(AppComponent)
  .catch(err => console.error(err));
