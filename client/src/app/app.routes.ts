import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "auth/success",
        loadComponent: () => import('./components/auth-success/auth-success.component').then(m => m.AuthSuccessComponent)
    }
];
