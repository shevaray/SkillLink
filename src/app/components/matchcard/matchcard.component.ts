import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { Match } from '../../services/matches.service';

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
  @Input() matchData: Match | null = null; // Full match data from API

  @Output() connect = new EventEmitter<Match>();
  @Output() viewProfile = new EventEmitter<Match>();

  showConnectModal: boolean = false;

  constructor(private router: Router) {}

  onConnectClick(): void {
    if (this.matchData) {
      this.connect.emit(this.matchData);
    }
    this.showConnectModal = true;
  }

  onCloseConnectModal(): void {
    this.showConnectModal = false;
  }

  onScheduleSession(userDetails: any): void {
    console.log('Schedule session with:', userDetails);
    this.showConnectModal = false;
    if (this.matchData) {
      this.connect.emit(this.matchData);
    }
  }

  onMessage(userDetails: any): void {
    console.log('Message user:', userDetails);
    this.showConnectModal = false;
    if (this.matchData) {
      this.connect.emit(this.matchData);
    }
  }

  onViewProfile(): void {
    if (this.matchData) {
      this.viewProfile.emit(this.matchData);
      console.log('Navigating to profile for user ID:', this.matchData.id);
      this.router.navigate(['/home/profile', this.matchData.id]).then(
        (success) => {
          console.log('Navigation successful:', success);
        },
        (error) => {
          console.error('Navigation failed:', error);
        }
      );
    } else {
      // Fallback for legacy usage
      console.log('Navigating to profile for user ID:', this.userId);
      this.router.navigate(['/home/profile', this.userId]);
    }
  }

  /**
   * Get user initials for connect modal
   */
  getUserDetails(): any {
    if (this.matchData) {
      return {
        id: this.matchData.id.toString(),
        name: this.matchData.name,
        avatar: this.matchData.profile_picture_path || '/assets/human-pic.png',
        gender: this.matchData.gender || 'Not specified',
        skillLevel: this.matchData.skill_level,
        initials: this.initials,
        teaches: this.teaches,
        wantsToLearn: this.wantsToLearn
      };
    }
    
    // Fallback for legacy usage
    return {
      id: this.userId,
      name: this.name,
      avatar: this.avatar,
      gender: this.gender,
      skillLevel: this.skillLevel,
      initials: this.initials,
      teaches: this.teaches,
      wantsToLearn: this.wantsToLearn
    };
  }
} 