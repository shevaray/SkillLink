import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface NotificationData {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  confirmText?: string;
  showCancel?: boolean;
  cancelText?: string;
}

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss']
})
export class NotificationModalComponent {
  @Input() isVisible: boolean = false;
  @Input() data: NotificationData | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
    this.close.emit();
  }

  onCancel(): void {
    this.cancel.emit();
    this.close.emit();
  }

  getIconClass(): string {
    switch (this.data?.type) {
      case 'success':
        return 'icon-success';
      case 'error':
        return 'icon-error';
      case 'warning':
        return 'icon-warning';
      case 'info':
      default:
        return 'icon-info';
    }
  }

  getModalClass(): string {
    return `notification-modal ${this.data?.type || 'info'}`;
  }
}