import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-matchcard',
  templateUrl: './matchcard.component.html',
  styleUrls: ['./matchcard.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class MatchCardComponent {
  @Input() initials: string = 'MR';
  @Input() name: string = 'Marcus Rodriguez';
  @Input() matchLabel: string = 'Perfect Match!';
  @Input() teaches: string = 'Photography';
  @Input() description: string = 'Full stack developer with 5+ years experience. I can help build modern web applications from scratch.';
  @Input() wantsToLearn: string = 'Guitar';
  @Input() avatar: string = '/assets/default-avatar.png';
  @Input() gender: string = 'Male';
  @Input() skillLevel: string = 'Intermediate';
  @Input() userId: string = '1';

  showConnectModal: boolean = false;

  constructor(private router: Router) {}

  onConnectClick(): void {
    this.showConnectModal = true;
  }

  onCloseConnectModal(): void {
    this.showConnectModal = false;
  }

  onScheduleSession(userDetails: any): void {
    console.log('Schedule session with:', userDetails);
    this.showConnectModal = false;
  }

  onMessage(userDetails: any): void {
    console.log('Message user:', userDetails);
    this.showConnectModal = false;
  }

  onViewProfile(): void {
    console.log('Navigating to profile for user ID:', this.userId);
    console.log('Navigation path:', `/home/profile/${this.userId}`);
    this.router.navigate(['/home/profile', this.userId]).then(
      (success) => {
        console.log('Navigation successful:', success);
      },
      (error) => {
        console.error('Navigation failed:', error);
      }
    );
  }
} 