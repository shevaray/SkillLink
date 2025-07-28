import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  onClose(): void {
    this.close.emit();
  }

  onScheduleSession(): void {
    if (this.userDetails) {
      console.log('Navigating to schedule session for user ID:', this.userDetails.id);
      this.router.navigate(['/home/schedule-session', this.userDetails.id]);
      this.close.emit();
    }
  }

  onMessage(): void {
    if (this.userDetails) {
      this.message.emit(this.userDetails);
      this.router.navigate(['/home/messages']);
      this.close.emit();
    }
  }
}
