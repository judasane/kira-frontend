
import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(APP_ROUTES, withHashLocation()),
    provideHttpClient(),
  ],
}).catch(err => console.error(err));
