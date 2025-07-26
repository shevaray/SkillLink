import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface UserDetails {
  id: string;
  name: string;
  avatar: string;
  gender: string;
  skillLevel: string;
}

@Component({
  selector: 'app-connect-modal',
  templateUrl: './connect-modal.component.html',
  styleUrls: ['./connect-modal.component.scss']
})
export class ConnectModalComponent {
  @Input() isVisible: boolean = false;
  @Input() userDetails: UserDetails | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() scheduleSession = new EventEmitter<UserDetails>();
  @Output() message = new EventEmitter<UserDetails>();

  constructor() { }

  onClose(): void {
    this.close.emit();
  }

  onScheduleSession(): void {
    if (this.userDetails) {
      this.scheduleSession.emit(this.userDetails);
    }
  }

  onMessage(): void {
    if (this.userDetails) {
      this.message.emit(this.userDetails);
    }
  }
}
