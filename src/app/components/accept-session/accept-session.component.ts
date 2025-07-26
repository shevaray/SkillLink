import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface SessionDetails {
  id: string;
  title: string;
  studentName: string;
  teaching: string;
  learning: string;
}

export type SessionAction = 'accept' | 'decline';

@Component({
  selector: 'app-accept-session',
  templateUrl: './accept-session.component.html',
  styleUrls: ['./accept-session.component.scss']
})
export class AcceptSessionComponent {
  @Input() isVisible: boolean = false;
  @Input() sessionDetails: SessionDetails | null = null;
  @Input() action: SessionAction = 'accept';
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<SessionDetails>();

  constructor() { }

  onClose(): void {
    this.close.emit();
  }

  onConfirm(): void {
    if (this.sessionDetails) {
      this.confirm.emit(this.sessionDetails);
    }
  }

  get modalTitle(): string {
    return this.action === 'accept' ? 'Session Accepted' : 'Decline Session';
  }

  get confirmButtonText(): string {
    return 'Confirm & Send';
  }

  onCancel(): void {
    this.close.emit();
  }
}
