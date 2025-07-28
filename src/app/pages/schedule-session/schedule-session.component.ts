import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface SessionUser {
  id: string;
  name: string;
  avatar: string;
  gender: string;
  skillLevel: string;
  availability: boolean[][];
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
  sessionUser: SessionUser = {
    id: '1',
    name: 'Emily Kim',
    avatar: '/assets/emily-kim.jpg',
    gender: 'Female',
    skillLevel: 'Beginner',
    availability: [
      [false, true, false, false, false, true, false], // 9am-11am
      [true, false, true, false, false, false, false], // 11am-1pm
      [false, false, false, false, false, false, false], // 1pm-3pm
      [false, false, false, false, false, false, false], // 3pm-5pm
      [false, false, false, false, false, true, false], // 5pm-7pm
      [false, false, false, false, true, false, true]  // 7pm-9pm
    ]
  };

  // Track current selections for the scheduler
  currentSelections: boolean[][] = [];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      // In a real application, you would fetch user data based on the ID
      console.log('Loading schedule session for user ID:', userId);
      this.loadSessionUser(userId);
    });
  }

  private loadSessionUser(userId: string): void {
    // In a real application, this would be an API call
    // For now, we'll simulate different user profiles based on ID
    if (userId === '2') {
      this.sessionUser = {
        id: '2',
        name: 'Marcus Rodriguez',
        avatar: '/assets/marcus-rodriguez.jpg',
        gender: 'Male',
        skillLevel: 'Advanced',
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
    
    // Initialize current selections with the user's availability
    this.currentSelections = this.sessionUser.availability.map(row => [...row]);
  }

  onBackClick(): void {
    console.log('Navigating back');
    this.router.navigate(['/home']);
  }

  onScheduleSession(): void {
    console.log('Scheduling session with:', this.sessionUser.name);
    console.log('Current selections:', this.currentSelections);
    // In a real application, this would submit the session request with the updated selections
    // For now, we'll just show a success message and navigate back
    alert('Session scheduled successfully!');
    this.router.navigate(['/home']);
  }

  onViewProfile(): void {
    console.log('Viewing profile for:', this.sessionUser.name);
    this.router.navigate(['/home/profile', this.sessionUser.id]);
  }

  onSchedulerSelectionChanged(slots: SchedulerSlot[]): void {
    console.log('Scheduler selections changed:', slots);
    // Update the current selections based on the emitted slots
    // This would typically update the user's availability in the backend
    this.currentSelections = this.sessionUser.availability.map(row => [...row]);
    
    // Update based on the new selections
    slots.forEach(slot => {
      const timeIndex = this.getTimeIndex(slot.time);
      const dayIndex = this.getDayIndex(slot.day);
      if (timeIndex !== -1 && dayIndex !== -1) {
        this.currentSelections[timeIndex][dayIndex] = slot.selected;
      }
    });
    
    console.log('Updated current selections:', this.currentSelections);
  }

  private getTimeIndex(time: string): number {
    const timeSlots = ['9am-11am', '11am-1pm', '1pm-3pm', '3pm-5pm', '5pm-7pm', '7pm-9pm'];
    return timeSlots.indexOf(time);
  }

  private getDayIndex(day: string): number {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.indexOf(day);
  }
}
