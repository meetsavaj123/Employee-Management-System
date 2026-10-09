import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngFor="let isVisible of [isLoading$ | async]" [ngClass]="{'show': isVisible}" class="spinner-overlay">
      <div class="spinner-box">
        <div class="ring"></div>
        <div class="loading-text">Loading...</div>
      </div>
    </div>
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(9, 13, 22, 0.7);
      backdrop-filter: blur(4px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }
    .spinner-overlay.show {
      opacity: 1;
      pointer-events: auto;
    }
    .spinner-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }
    .ring {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(99, 102, 241, 0.2);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    .loading-text {
      color: #94a3b8;
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class SpinnerComponent {
  private loadingService = inject(LoadingService);
  isLoading$ = this.loadingService.isLoading$;
}
