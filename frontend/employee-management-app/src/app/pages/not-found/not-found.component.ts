import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-wrapper animate-fade-in">
      <div class="not-found-card glass-card">
        <div class="error-code">404</div>
        <h2>Page Not Found</h2>
        <p>The requested page or resource could not be found on the system server.</p>
        <a routerLink="/dashboard" class="btn btn-primary">
          <span>Return to Dashboard</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .not-found-wrapper {
      min-height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .not-found-card {
      text-align: center;
      padding: 50px 40px;
      max-width: 460px;
      width: 100%;
    }
    .error-code {
      font-size: 5rem;
      font-weight: 800;
      color: var(--primary);
      line-height: 1;
      margin-bottom: 10px;
      text-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
    }
    h2 { font-size: 1.6rem; font-weight: 700; margin-bottom: 10px; }
    p { color: var(--text-muted); margin-bottom: 24px; font-size: 0.92rem; }
  `]
})
export class NotFoundComponent {}
