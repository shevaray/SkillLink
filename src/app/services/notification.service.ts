import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NotificationData {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  confirmText?: string;
  showCancel?: boolean;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private isVisibleSubject = new BehaviorSubject<boolean>(false);
  private dataSubject = new BehaviorSubject<NotificationData | null>(null);
  
  public isVisible$ = this.isVisibleSubject.asObservable();
  public data$ = this.dataSubject.asObservable();

  constructor() { }

  /**
   * Show a success notification
   */
  showSuccess(message: string, title?: string): void {
    this.show({
      message,
      title,
      type: 'success',
      confirmText: 'OK'
    });
  }

  /**
   * Show an error notification
   */
  showError(message: string, title?: string): void {
    this.show({
      message,
      title: title || 'Error',
      type: 'error',
      confirmText: 'OK'
    });
  }

  /**
   * Show an info notification
   */
  showInfo(message: string, title?: string): void {
    this.show({
      message,
      title,
      type: 'info',
      confirmText: 'OK'
    });
  }

  /**
   * Show a warning notification
   */
  showWarning(message: string, title?: string): void {
    this.show({
      message,
      title: title || 'Warning',
      type: 'warning',
      confirmText: 'OK'
    });
  }

  /**
   * Show a confirmation dialog
   */
  showConfirm(
    message: string, 
    title?: string, 
    confirmText: string = 'Confirm', 
    cancelText: string = 'Cancel'
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.show({
        message,
        title,
        type: 'info',
        confirmText,
        cancelText,
        showCancel: true
      });

      // Handle the result
      const subscription = this.isVisible$.subscribe(isVisible => {
        if (!isVisible) {
          subscription.unsubscribe();
          resolve(false); // Assume cancelled if modal is closed
        }
      });
    });
  }

  /**
   * Show a custom notification
   */
  show(data: NotificationData): void {
    this.dataSubject.next(data);
    this.isVisibleSubject.next(true);
  }

  /**
   * Hide the notification
   */
  hide(): void {
    this.isVisibleSubject.next(false);
    // Clear data after animation
    setTimeout(() => {
      this.dataSubject.next(null);
    }, 300);
  }
}