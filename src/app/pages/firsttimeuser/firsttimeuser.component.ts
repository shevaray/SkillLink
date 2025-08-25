import { Component, OnInit } from '@angular/core';
import { AuthService, UserProfile } from '../../services/auth.service';

@Component({
  selector: 'app-firsttimeuser',
  templateUrl: './firsttimeuser.component.html',
  styleUrls: ['./firsttimeuser.component.scss'],
  standalone: true
})
export class FirstTimeUserComponent implements OnInit {
  userProfile: UserProfile | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.userProfile = this.authService.getCurrentUser();
    
    this.authService.fetchUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.authService.updateStoredUserProfile(profile);
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
      }
    });
  }

  getUserFirstName(): string {
    if (this.userProfile?.name) {
      return this.userProfile.name.split(' ')[0];
    }
    return 'User';
  }
} 