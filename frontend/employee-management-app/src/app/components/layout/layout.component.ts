import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-container" [ngClass]="{'sidebar-collapsed': isCollapsed}">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="brand">
            <div class="logo-icon">EMS</div>
            <span class="logo-text" *ngIf="!isCollapsed">Enterprise EMS</span>
          </div>
          <button class="toggle-btn" (click)="toggleSidebar()">
            <span class="icon">{{ isCollapsed ? '❯' : '❮' }}</span>
          </button>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📊</span>
            <span class="nav-label" *ngIf="!isCollapsed">Dashboard</span>
          </a>

          <a routerLink="/employees" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">👥</span>
            <span class="nav-label" *ngIf="!isCollapsed">Employees</span>
          </a>

          <a *ngIf="isAdmin" routerLink="/departments" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🏢</span>
            <span class="nav-label" *ngIf="!isCollapsed">Departments</span>
          </a>

          <a *ngIf="isAdmin" routerLink="/designations" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🏷️</span>
            <span class="nav-label" *ngIf="!isCollapsed">Designations</span>
          </a>

          <div class="nav-divider"></div>

          <a routerLink="/profile" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">👤</span>
            <span class="nav-label" *ngIf="!isCollapsed">My Profile</span>
          </a>

          <a routerLink="/change-password" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🔒</span>
            <span class="nav-label" *ngIf="!isCollapsed">Change Password</span>
          </a>
        </nav>

        <div class="sidebar-footer" *ngIf="!isCollapsed">
          <div class="user-info">
            <div class="avatar">{{ username.charAt(0).toUpperCase() }}</div>
            <div class="details">
              <span class="username">{{ username }}</span>
              <span class="role-badge">{{ role }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Shell -->
      <div class="main-wrapper">
        <!-- Top Header -->
        <header class="top-header">
          <div class="header-title">
            <span class="welcome-text">Employee Management System</span>
          </div>

          <div class="header-actions">
            <div class="user-pill">
              <span class="dot"></span>
              <span class="name">{{ username }} ({{ role }})</span>
            </div>
            <button class="btn btn-secondary btn-sm" (click)="logout()">
              <span>Logout</span>
              <span>🚪</span>
            </button>
          </div>
        </header>

        <!-- Page Content -->
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
      background: var(--bg-dark);
    }

    /* Sidebar */
    .sidebar {
      width: 260px;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: fixed;
      top: 0; bottom: 0; left: 0;
      z-index: 100;
    }
    .sidebar-collapsed .sidebar {
      width: 80px;
    }

    .sidebar-header {
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      border-bottom: 1px solid var(--border-color);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
      color: white;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
    }
    .logo-text {
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--text-main);
    }
    .toggle-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 1rem;
      padding: 4px;
    }

    .sidebar-nav {
      padding: 20px 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.92rem;
      transition: all 0.2s ease;
    }
    .nav-item:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.05);
    }
    .nav-item.active {
      color: white;
      background: var(--primary);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    .nav-icon {
      font-size: 1.15rem;
    }
    .nav-divider {
      height: 1px;
      background: var(--border-color);
      margin: 12px 0;
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid var(--border-color);
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #334155;
      color: #f1f5f9;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .details {
      display: flex;
      flex-direction: column;
    }
    .username {
      font-weight: 600;
      font-size: 0.85rem;
      color: var(--text-main);
    }
    .role-badge {
      font-size: 0.7rem;
      color: var(--primary);
      font-weight: 700;
      text-transform: uppercase;
    }

    /* Main Wrapper */
    .main-wrapper {
      flex: 1;
      margin-left: 260px;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .sidebar-collapsed .main-wrapper {
      margin-left: 80px;
    }

    .top-header {
      height: 70px;
      background: var(--bg-header);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
      position: sticky;
      top: 0;
      z-index: 90;
    }
    .welcome-text {
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--text-main);
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .user-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.05);
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid var(--border-color);
      font-size: 0.85rem;
      font-weight: 600;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--success);
    }

    .page-content {
      padding: 30px;
      flex: 1;
    }
  `]
})
export class LayoutComponent {
  isCollapsed = false;

  constructor(private authService: AuthService, private router: Router) {}

  get username(): string {
    return this.authService.currentUserValue?.username || 'User';
  }

  get role(): string {
    return this.authService.currentUserValue?.role || 'Employee';
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
