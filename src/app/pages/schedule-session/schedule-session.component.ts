import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchesService, Match, Skill } from '../../services/matches.service';
import { SessionService, SessionRequest } from '../../services/session.service';
import { NotificationService } from '../../services/notification.service';

interface SessionUser {
  id: number;
  name: string;
  avatar: string;
  gender: string;
  skillLevel: string;
  availability: boolean[][];
  skills_to_teach?: Skill[];
}

interface SchedulerSlot {
  time: string;
  day: string;
  date: Date;
  selected: boolean;
}

@Component({
  selector: 'app-schedule-session',
  templateUrl: './schedule-session.component.html',
  styleUrls: ['./schedule-session.component.scss']
})
export class ScheduleSessionComponent implements OnInit {
  sessionUser: SessionUser | null = null;
  teacherId: number | null = null;
  selectedSkillId: number | null = null;
  selectedDateTime: string | null = null;
  availableSkills: Skill[] = [];
  loading = false;
  error = '';

  // Track current selections for the scheduler
  currentSelections: boolean[][] = [];
  selectedSlot: SchedulerSlot | null = null;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private matchesService: MatchesService,
    private sessionService: SessionService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        this.teacherId = parseInt(userId, 10);
        console.log('Loading schedule session for user ID:', this.teacherId);
        this.loadSessionUser(this.teacherId);
      } else {
        this.error = 'No user ID provided';
        console.error('No user ID provided in route parameters');
      }
    });
  }

  private loadSessionUser(userId: number): void {
    this.loading = true;
    this.error = '';
    
    this.matchesService.getUserProfile(userId).subscribe({
      next: (userProfile: Match) => {
        this.sessionUser = {
          id: userProfile.id,
          name: userProfile.name,
          avatar: userProfile.profile_picture_path || '/assets/human-pic.png',
          gender: userProfile.gender || 'Not specified',
          skillLevel: userProfile.skill_level,
          availability: this.parseAvailability(userProfile.availability),
          skills_to_teach: userProfile.skills_to_teach
        };
        
        this.availableSkills = userProfile.skills_to_teach || [];
        
        // Initialize current selections with empty array (user will select their preferred times)
        this.currentSelections = this.sessionUser.availability ? 
          this.sessionUser.availability.map(row => [...row]) : 
          this.getDefaultAvailability();
        
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to load user profile. Please try again.';
        console.error('Error loading user profile:', error);
      }
    });
  }

  onBackClick(): void {
    console.log('Navigating back');
    this.router.navigate(['/home']);
  }

  onScheduleSession(): void {
    if (!this.teacherId || !this.selectedSkillId || !this.selectedDateTime) {
      this.error = 'Please select a skill and time slot before scheduling.';
      return;
    }

    const sessionRequest: SessionRequest = {
      teacher_id: this.teacherId,
      skill_id: this.selectedSkillId,
      scheduled_at: this.selectedDateTime
    };

    this.loading = true;
    this.error = '';

    this.sessionService.scheduleSession(sessionRequest).subscribe({
      next: (response) => {
        console.log('Session scheduled successfully:', response);
        this.notificationService.showSuccess('Session scheduled successfully!');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to schedule session. Please try again.';
        console.error('Error scheduling session:', error);
      }
    });
  }

  onViewProfile(): void {
    if (this.sessionUser) {
      console.log('Viewing profile for:', this.sessionUser.name);
      this.router.navigate(['/home/profile', this.sessionUser.id]);
    }
  }

  onSchedulerSelectionChanged(slots: SchedulerSlot[]): void {
    console.log('Scheduler selections changed:', slots);
    
    // Find the selected slot (assuming single selection for scheduling)
    const selectedSlots = slots.filter(slot => slot.selected);
    if (selectedSlots.length > 0) {
      this.selectedSlot = selectedSlots[0]; // Take the first selected slot
      this.generateDateTimeString();
    } else {
      this.selectedSlot = null;
      this.selectedDateTime = null;
    }
    
    console.log('Selected slot:', this.selectedSlot);
    console.log('Selected date time:', this.selectedDateTime);
  }

  private getTimeIndex(time: string): number {
    const timeSlots = ['9am-11am', '11am-1pm', '1pm-3pm', '3pm-5pm', '5pm-7pm', '7pm-9pm'];
    return timeSlots.indexOf(time);
  }

  private getDayIndex(day: string): number {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.indexOf(day);
  }

  onSkillChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      this.selectedSkillId = parseInt(target.value, 10);
      console.log('Selected skill ID:', this.selectedSkillId);
    }
  }

  onSkillSelected(skillId: number): void {
    this.selectedSkillId = skillId;
    console.log('Selected skill ID:', skillId);
  }

  private parseAvailability(availabilityString: string): boolean[][] {
    try {
      if (availabilityString) {
        return JSON.parse(availabilityString);
      }
    } catch (error) {
      console.warn('Failed to parse availability:', error);
    }
    return this.getDefaultAvailability();
  }

  private getDefaultAvailability(): boolean[][] {
    // Return a default 6x7 availability grid (6 time slots, 7 days)
    return [
      [false, false, false, false, false, false, false], // 9am-11am
      [false, false, false, false, false, false, false], // 11am-1pm
      [false, false, false, false, false, false, false], // 1pm-3pm
      [false, false, false, false, false, false, false], // 3pm-5pm
      [false, false, false, false, false, false, false], // 5pm-7pm
      [false, false, false, false, false, false, false]  // 7pm-9pm
    ];
  }

  private generateDateTimeString(): void {
    if (!this.selectedSlot) {
      this.selectedDateTime = null;
      return;
    }

    // Get next occurrence of the selected day
    const dayIndex = this.getDayIndex(this.selectedSlot.day);
    const today = new Date();
    const todayDayIndex = (today.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0 format
    
    let daysUntilTarget = dayIndex - todayDayIndex;
    if (daysUntilTarget <= 0) {
      daysUntilTarget += 7; // Move to next week if day has passed
    }
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);
    
    // Set time based on time slot
    const timeSlotHours = this.getTimeSlotHours(this.selectedSlot.time);
    targetDate.setHours(timeSlotHours, 0, 0, 0);
    
    // Format to match API expectation: "2025-12-31 23:59:59"
    this.selectedDateTime = this.formatDateForAPI(targetDate);
  }

  private getTimeSlotHours(timeSlot: string): number {
    const timeSlots: { [key: string]: number } = {
      '9am-11am': 9,
      '11am-1pm': 11,
      '1pm-3pm': 13,
      '3pm-5pm': 15,
      '5pm-7pm': 17,
      '7pm-9pm': 19
    };
    return timeSlots[timeSlot] || 9;
  }

  private formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  getSelectedSkillName(): string {
    const selectedSkill = this.availableSkills.find(skill => skill.id === this.selectedSkillId);
    return selectedSkill ? selectedSkill.name : '';
  }

  formatSelectedDateTime(): string {
    if (!this.selectedDateTime) return '';
    
    try {
      const date = new Date(this.selectedDateTime.replace(' ', 'T'));
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return this.selectedDateTime;
    }
  }
}
