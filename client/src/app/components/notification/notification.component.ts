import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="notification" [ngClass]="type">
      <div class="notification-content">
        <div class="notification-icon">
          <span *ngIf="type === 'success'">✅</span>
          <span *ngIf="type === 'error'">❌</span>
          <span *ngIf="type === 'info'">ℹ️</span>
        </div>
        <div class="notification-message">{{ message }}</div>
        <button class="notification-close" (click)="close()">×</button>
      </div>
    </div>
  `,
  styles: [`
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      min-width: 300px;
      max-width: 500px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
      animation: slideIn 0.3s ease-out;
    }
    .notification.success {
      background: linear-gradient(135deg, rgba(46, 204, 113, 0.95), rgba(39, 174, 96, 0.95));
      border: 2px solid rgba(46, 204, 113, 0.3);
    }
    .notification.error {
      background: linear-gradient(135deg, rgba(231, 76, 60, 0.95), rgba(192, 57, 43, 0.95));
      border: 2px solid rgba(231, 76, 60, 0.3);
    }
    .notification.info {
      background: linear-gradient(135deg, rgba(52, 152, 219, 0.95), rgba(41, 128, 185, 0.95));
      border: 2px solid rgba(52, 152, 219, 0.3);
    }
    .notification-content {
      display: flex;
      align-items: center;
      padding: 15px 20px;
      color: white;
    }
    .notification-icon {
      font-size: 20px;
      margin-left: 10px;
    }
    .notification-message {
      flex: 1;
      font-size: 16px;
      font-weight: 500;
      margin: 0 15px;
    }
    .notification-close {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    .notification-close:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class NotificationComponent {
  @Input() show = false;
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'info' = 'success';
  @Output() onClose = new EventEmitter<void>();

  close() {
    this.show = false;
    this.onClose.emit();
  }
}