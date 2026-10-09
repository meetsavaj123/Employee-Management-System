import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'employees',
        loadComponent: () => import('./pages/employee-list/employee-list.component').then(m => m.EmployeeListComponent)
      },
      {
        path: 'employees/add',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/employee-form/employee-form.component').then(m => m.EmployeeFormComponent)
      },
      {
        path: 'employees/edit/:id',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/employee-form/employee-form.component').then(m => m.EmployeeFormComponent)
      },
      {
        path: 'employees/details/:id',
        loadComponent: () => import('./pages/employee-details/employee-details.component').then(m => m.EmployeeDetailsComponent)
      },
      {
        path: 'departments',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/department-list/department-list.component').then(m => m.DepartmentListComponent)
      },
      {
        path: 'designations',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/designation-list/designation-list.component').then(m => m.DesignationListComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'change-password',
        loadComponent: () => import('./pages/change-password/change-password.component').then(m => m.ChangePasswordComponent)
      }
    ]
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }
];
