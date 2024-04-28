import { Routes } from '@angular/router';
import { isAuthenticatedGuard, notAuthenticatedGuard } from '@guards/auth.guard';

export const routes: Routes = [
  {
    path: 'chat',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () => import('./pages/chat/chat.component').then(c => c.ChatComponent)
  },
  {
    path: 'login',
    canActivate: [notAuthenticatedGuard],
    loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent)
  },
  { path: '**', redirectTo: 'login' }
];
