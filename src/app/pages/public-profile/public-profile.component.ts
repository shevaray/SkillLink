import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchesService, Match } from '../../services/matches.service';
import { NotificationService } from '../../services/notification.service';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  gender: string;
  skillLevel: string;
  aboutMe: string;
  teachingStyle: string;
  skillsOffered: string[];
  skillsLearning: string[];
  stats: {
    skillsOffered: number;
    skillsLearning: number;
    sessionsCompleted: number;
  };
  availability: boolean[][];
}

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  loading = false;
  error = '';
  
  // Connect modal state
  showConnectModal: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private matchesService: MatchesService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      console.log('Loading profile for user ID:', userId);
      this.loadUserProfile(userId);
    });
  }

  private loadUserProfile(userId: string): void {
    this.loading = true;
    this.error = '';
    
    const userIdNumber = parseInt(userId, 10);
    
    this.matchesService.getUserProfile(userIdNumber).subscribe({
      next: (match: Match) => {
        this.loading = false;
        this.userProfile = this.mapMatchToUserProfile(match);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.message || 'Failed to load user profile.';
        console.error('Error loading user profile:', error);
      }
    });
  }

  /**
   * Map API Match object to UserProfile interface
   */
  private mapMatchToUserProfile(match: Match): UserProfile {
    // Extract skills from new API structure or fallback to old structure
    const skillsOffered = match.skills_to_teach?.map(skill => skill.name) || match.teaches || [];
    const skillsLearning = match.skills_to_learn?.map(skill => skill.name) || match.wants_to_learn || [];
    
    return {
      id: match.id.toString(),
      name: match.name,
      avatar: match.profile_picture_path || '/assets/default-avatar.png',
      gender: match.gender || 'To be determined',
      skillLevel: match.skill_level,
      aboutMe: match.about_me,
      teachingStyle: match.teaching_style,
      skillsOffered: skillsOffered,
      skillsLearning: skillsLearning,
      stats: {
        skillsOffered: skillsOffered.length,
        skillsLearning: skillsLearning.length,
        sessionsCompleted: 0 // TODO: Get from API when available
      },
      availability: this.parseAvailability(match.availability)
    };
  }

  /**
   * Parse availability JSON string to boolean array
   */
  private parseAvailability(availabilityString: string): boolean[][] {
    try {
      const parsed = JSON.parse(availabilityString);
      // If it's already in the correct format, return it
      if (Array.isArray(parsed) && Array.isArray(parsed[0])) {
        return parsed;
      }
      // Otherwise, return default availability
      return this.getDefaultAvailability();
    } catch (error) {
      console.warn('Failed to parse availability:', error);
      return this.getDefaultAvailability();
    }
  }

  /**
   * Get default availability matrix
   */
  private getDefaultAvailability(): boolean[][] {
    return [
      [false, false, false, false, false, false, false], // 9am-11am
      [false, false, false, false, false, false, false], // 11am-1pm
      [false, false, false, false, false, false, false], // 1pm-3pm
      [false, false, false, false, false, false, false], // 3pm-5pm
      [false, false, false, false, false, false, false], // 5pm-7pm
      [false, false, false, false, false, false, false]  // 7pm-9pm
    ];
  }

  /**
   * Retry loading profile
   */
  retryLoad(): void {
    const userId = this.route.snapshot.params['id'];
    if (userId) {
      this.loadUserProfile(userId);
    }
  }

  /**
   * Generate initials from name
   */
  generateInitials(name: string): string {
    return MatchesService.generateInitials(name);
  }

  /**
   * Handle image load error by setting fallback image
   */
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = '/assets/human-pic.png';
    }
  }

  // Legacy method for fallback - can be removed later
  private loadUserProfileLegacy(userId: string): void {
    if (userId === '2') {
      this.userProfile = {
        id: '2',
        name: 'Marcus Rodriguez',
        avatar: '/assets/marcus-rodriguez.jpg',
        gender: 'Male',
        skillLevel: 'Advanced',
        aboutMe: 'Experienced full stack developer with 5+ years of experience in modern web technologies. Passionate about teaching and helping others learn programming concepts.',
        teachingStyle: 'I believe in hands-on learning with real-world projects. My sessions are interactive and focused on practical application of concepts.',
        skillsOffered: ['JavaScript', 'React', 'Node.js', 'Python'],
        skillsLearning: ['Machine Learning', 'DevOps', 'Mobile Development'],
        stats: {
          skillsOffered: 8,
          skillsLearning: 5,
          sessionsCompleted: 67
        },
        availability: [
          [true, false, true, false, true, false, false], // 9am-11am
          [false, true, false, true, false, true, false], // 11am-1pm
          [true, false, true, false, true, false, true], // 1pm-3pm
          [false, true, false, true, false, true, false], // 3pm-5pm
          [true, false, true, false, true, false, true], // 5pm-7pm
          [false, true, false, true, false, true, false] // 7pm-9pm
        ]
      };
    }
    // Default profile (Sarah Anderson) is already set
  }

  // Connect modal methods
  onConnectClick(): void {
    if (this.userProfile) {
      console.log('Opening connect modal for:', this.userProfile.name);
      this.showConnectModal = true;
    }
  }

  onCloseConnectModal(): void {
    console.log('Closing connect modal');
    this.showConnectModal = false;
  }

  onScheduleSession(userDetails?: any): void {
    if (this.userProfile) {
      console.log('Navigating to schedule session for:', this.userProfile.name);
      this.router.navigate(['/home/schedule-session', this.userProfile.id]);
      this.showConnectModal = false;
    }
  }

  onMessage(userDetails?: any): void {
    if (this.userProfile) {
      console.log('Opening message for:', this.userProfile.name);
      // In a real application, this would open a messaging interface
              this.notificationService.showInfo('Message feature coming soon!');
      this.showConnectModal = false;
    }
  }
}
