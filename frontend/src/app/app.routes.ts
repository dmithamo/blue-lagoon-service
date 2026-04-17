import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'reservations', loadComponent: () => import('./pages/reservations/reservations').then(m => m.Reservations) },
  { path: 'about', loadComponent: () => import('./pages/about/about').then(m => m.About) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.Contact) },
];
