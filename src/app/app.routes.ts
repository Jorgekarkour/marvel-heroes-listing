import { Routes } from '@angular/router';
import { HeroDashboardComponent } from '@containers/hero-dashboard/hero-dashboard.component';

export const routes: Routes = [
    { path: '', component: HeroDashboardComponent },
    { path: '**', redirectTo: '' }
];
