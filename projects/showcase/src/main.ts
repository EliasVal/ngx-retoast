import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRetoast } from 'ngx-retoast';

bootstrapApplication(AppComponent, {
  providers: [provideBrowserGlobalErrorListeners(), provideRetoast()],
}).catch((err) => console.error(err));
