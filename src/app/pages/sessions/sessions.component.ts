import { Component, OnInit } from '@angular/core';

export interface Session {
  id: string;
  title: string;
  status: 'upcoming' | 'completed' | 'pending';
  partnerName: string;
  partnerInitials: string;
  teaching: string;
  learning: string;
  time: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {
  sessions: Session[] = [
    {
      id: 'js-fundamentals',
      title: 'JavaScript Fundamentals',
      status: 'upcoming',
      partnerName: 'Sarah Chen',
      partnerInitials: 'SC',
      teaching: 'JavaScript',
      learning: 'Web Design',
      time: 'Tomorrow, 3:00 PM - 4:00PM',
      primaryButtonText: 'Join Session',
      secondaryButtonText: 'Reschedule'
    },
    {
      id: 'spanish-conversation',
      title: 'Spanish Conversation Practice',
      status: 'completed',
      partnerName: 'Maria Rodriguez',
      partnerInitials: 'MR',
      teaching: 'Spanish',
      learning: 'Web Design',
      time: 'Yesterday, 3:00 PM - 4:00PM',
      primaryButtonText: 'Book Another',
      secondaryButtonText: 'Message'
    },
    {
      id: 'python-data',
      title: 'Python Data Analysis',
      status: 'pending',
      partnerName: 'Alex Johnson',
      partnerInitials: 'AJ',
      teaching: 'Spanish',
      learning: 'Web Design',
      time: 'Waiting for confirmation',
      primaryButtonText: 'Accept',
      secondaryButtonText: 'Decline'
    }
  ];

  selectedStatus: 'all' | 'upcoming' | 'completed' | 'pending' = 'all';
  showJoinSessionModal: boolean = false;
  showAcceptSessionModal: boolean = false;
  showDeclineSessionModal: boolean = false;
  selectedSessionForAccept: Session | null = null;
  selectedSessionForDecline: Session | null = null;

  constructor() { }

  ngOnInit(): void {}

  get filteredSessions(): Session[] {
    if (this.selectedStatus === 'all') {
      return this.sessions;
    }
    return this.sessions.filter(session => session.status === this.selectedStatus);
  }

  onStatusChange(status: 'all' | 'upcoming' | 'completed' | 'pending'): void {
    this.selectedStatus = status;
  }

  onPrimaryButtonClick(session: Session): void {
    console.log('Primary button clicked for session:', session.id);
    if (session.primaryButtonText === 'Join Session') {
      this.showJoinSessionModal = true;
    } else if (session.primaryButtonText === 'Accept') {
      this.selectedSessionForAccept = session;
      this.showAcceptSessionModal = true;
    }
    // Add your logic here for handling other primary button clicks
  }

  onSecondaryButtonClick(session: Session): void {
    console.log('Secondary button clicked for session:', session.id);
    if (session.secondaryButtonText === 'Decline') {
      this.selectedSessionForDecline = session;
      this.showDeclineSessionModal = true;
    }
    // Add your logic here for handling other secondary button clicks
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'upcoming':
        return '#E5E1FB';
      case 'completed':
        return '#E1FBE3';
      case 'pending':
        return '#FBE1E1';
      default:
        return '#E5E1FB';
    }
  }

  getStatusTextColor(status: string): string {
    switch (status) {
      case 'upcoming':
        return '#6C57DB';
      case 'completed':
        return '#19B423';
      case 'pending':
        return '#E47373';
      default:
        return '#6C57DB';
    }
  }

  onCloseJoinSessionModal(): void {
    this.showJoinSessionModal = false;
  }

  onCloseAcceptSessionModal(): void {
    this.showAcceptSessionModal = false;
    this.selectedSessionForAccept = null;
  }

  onConfirmAcceptSession(sessionDetails: any): void {
    console.log('Session accepted:', sessionDetails);
    // Add your logic here for handling session acceptance
    this.showAcceptSessionModal = false;
    this.selectedSessionForAccept = null;
  }

  onCloseDeclineSessionModal(): void {
    this.showDeclineSessionModal = false;
    this.selectedSessionForDecline = null;
  }

  onConfirmDeclineSession(sessionDetails: any): void {
    console.log('Session declined:', sessionDetails);
    // Add your logic here for handling session decline
    this.showDeclineSessionModal = false;
    this.selectedSessionForDecline = null;
  }
}
