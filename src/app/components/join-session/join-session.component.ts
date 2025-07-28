import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface MeetingPlatform {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}

@Component({
  selector: 'app-join-session',
  templateUrl: './join-session.component.html',
  styleUrls: ['./join-session.component.scss']
})
export class JoinSessionComponent {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  platforms: MeetingPlatform[] = [
    {
      id: 'google-meet',
      name: 'Google Meet',
      icon: 'video',
      selected: true
    },
    {
      id: 'microsoft-teams',
      name: 'Microsoft Teams',
      icon: 'people',
      selected: false
    },
    {
      id: 'zoom',
      name: 'Zoom',
      icon: 'video',
      selected: false
    }
  ];

  meetingLink: string = 'https://meet.google.com/abc-defghj';

  constructor() { }

  onClose(): void {
    this.close.emit();
  }

  selectPlatform(platformId: string): void {
    this.platforms.forEach(platform => {
      platform.selected = platform.id === platformId;
    });
    
    // Update meeting link based on selected platform
    switch (platformId) {
      case 'google-meet':
        this.meetingLink = 'https://meet.google.com/abc-defghj';
        break;
      case 'microsoft-teams':
        this.meetingLink = 'https://teams.microsoft.com/l/meetup-join/abc123';
        break;
      case 'zoom':
        this.meetingLink = 'https://zoom.us/j/123456789';
        break;
    }
  }

  copyMeetingLink(): void {
    navigator.clipboard.writeText(this.meetingLink).then(() => {
      // You can add a toast notification here
      console.log('Meeting link copied to clipboard');
    });
  }

  shareLink(): void {
    // Add your logic for sharing the link
    console.log('Sharing link:', this.meetingLink);
  }

  cancel(): void {
    this.close.emit();
  }

  getSelectedPlatform(): MeetingPlatform | undefined {
    return this.platforms.find(platform => platform.selected);
  }
}
