import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts$ | async" class="toast-card" [ngClass]="toast.type">
        <div class="toast-content">
          <div class="toast-title">{{ toast.title }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button class="toast-close" (click)="remove(toast.id)">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 380px;
      width: 100%;
    }
    .toast-card {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 14px 18px;
      border-radius: 10px;
      color: white;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      animation: slideIn 0.3s ease forwards;
    }
    .toast-card.success { background: rgba(16, 185, 129, 0.95); border-left: 4px solid #059669; }
    .toast-card.danger { background: rgba(239, 68, 68, 0.95); border-left: 4px solid #dc2626; }
    .toast-card.warning { background: rgba(245, 158, 11, 0.95); border-left: 4px solid #d97706; }
    .toast-card.info { background: rgba(6, 182, 212, 0.95); border-left: 4px solid #0891b2; }
    .toast-title { font-weight: 700; font-size: 0.95rem; margin-bottom: 2px; }
    .toast-message { font-size: 0.85rem; opacity: 0.9; }
    .toast-close { background: none; border: none; color: white; font-size: 1.4rem; cursor: pointer; line-height: 1; padding: 0 0 0 10px; }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toasts$ = this.toastService.toasts$;

  remove(id: number) {
    this.toastService.remove(id);
  }
}
