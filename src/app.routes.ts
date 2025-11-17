import { Routes } from '@angular/router';
import { CheckoutComponent } from './components/checkout/checkout.component';

export const APP_ROUTES: Routes = [
  {
    path: 'links/:id',
    component: CheckoutComponent
  },
  {
    path: 'links',
    component: CheckoutComponent
  },
  {
    path: '',
    redirectTo: '/links',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/links'
  }
];