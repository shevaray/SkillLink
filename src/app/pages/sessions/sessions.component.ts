import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SessionService, SessionResponse } from '../../services/session.service';
import { MatchesService } from '../../services/matches.service';
import { AuthService, UserProfile } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

export interface Session {
  id: number;
  title: string;
  status: 'upcoming' | 'completed' | 'pending';
  partnerName: string;
  partnerInitials: string;
  teaching: string;
  learning: string;
  time: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  teacher_id: number;
  student_id: number;
  skill_id: number;
  scheduled_at: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit, OnDestroy {
  sessions: Session[] = [];
  loading = false;
  error = '';
  currentUser: UserProfile | null = null;
  
  private destroy$ = new Subject<void>();

  selectedStatus: 'all' | 'upcoming' | 'completed' | 'pending' = 'all';
  showJoinSessionModal: boolean = false;
  showAcceptSessionModal: boolean = false;
  showDeclineSessionModal: boolean = false;
  selectedSessionForAccept: Session | null = null;
  selectedSessionForDecline: Session | null = null;

  constructor(
    private sessionService: SessionService,
    private matchesService: MatchesService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadSessions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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
    
    switch (session.primaryButtonText) {
      case 'Join Session':
        this.showJoinSessionModal = true;
        break;
      case 'Accept':
        this.selectedSessionForAccept = session;
        this.showAcceptSessionModal = true;
        break;
      case 'Book Another':
        // Navigate to find matches or schedule new session
        console.log('Book another session for:', session.partnerName);
        // You can implement navigation to matches or direct scheduling here
        break;
      case 'Details':
        console.log('Details clicked for session:', session.id);
        // TODO: Implement details functionality
        break;
      default:
        console.log('Primary action for:', session.primaryButtonText);
    }
  }

  onSecondaryButtonClick(session: Session): void {
    console.log('Secondary button clicked for session:', session.id);
    
    switch (session.secondaryButtonText) {
      case 'Decline':
        this.selectedSessionForDecline = session;
        this.showDeclineSessionModal = true;
        break;
      case 'Reschedule':
        console.log('Reschedule session:', session.id);
        // You can implement reschedule functionality here
        break;
      case 'Message':
        console.log('Message partner:', session.partnerName);
        // You can implement messaging functionality here
        break;
      default:
        console.log('Secondary action for:', session.secondaryButtonText);
    }
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
    if (this.selectedSessionForAccept) {
      this.acceptSession(this.selectedSessionForAccept);
    }
    this.showAcceptSessionModal = false;
    this.selectedSessionForAccept = null;
  }

  onCloseDeclineSessionModal(): void {
    this.showDeclineSessionModal = false;
    this.selectedSessionForDecline = null;
  }

  onConfirmDeclineSession(sessionDetails: any): void {
    console.log('Session declined:', sessionDetails);
    if (this.selectedSessionForDecline) {
      this.declineSession(this.selectedSessionForDecline);
    }
    this.showDeclineSessionModal = false;
    this.selectedSessionForDecline = null;
  }

  /**
   * Load sessions from API
   */
  private loadSessions(): void {
    this.loading = true;
    this.error = '';

    this.sessionService.getUserSessions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sessions) => {
          console.log('Raw sessions from API:', JSON.stringify(sessions, null, 2));
          this.sessions = this.transformSessions(sessions);
          console.log('Transformed sessions:', this.sessions.map(s => ({ id: s.id, status: s.status, apiStatus: sessions.find(api => api.id === s.id)?.status })));
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Failed to load sessions. Please try again.';
          console.error('Error loading sessions:', error);
        }
      });
  }

  /**
   * Transform API sessions to component format
   */
  private transformSessions(apiSessions: SessionResponse[]): Session[] {
    return apiSessions.map(apiSession => {
      const isTeacher = !!(this.currentUser && apiSession.teacher_id === this.currentUser.id);
      const partnerId = isTeacher ? apiSession.student_id : apiSession.teacher_id;
      
      // Get skill name from the session data
      const skillName = apiSession.skill?.name || 'Unknown Skill';
      
      const mappedStatus = this.mapApiStatus(apiSession.status);
      const session: Session = {
        id: apiSession.id,
        title: this.generateSessionTitle(apiSession),
        status: mappedStatus,
        partnerName: 'Loading...', // Will be updated when we fetch partner data
        partnerInitials: 'LL',
        teaching: skillName,
        learning: skillName,
        time: this.formatSessionTime(apiSession.scheduled_at, apiSession.status),
        primaryButtonText: isTeacher ? 'Details' : this.getPrimaryButtonText(mappedStatus, isTeacher),
        secondaryButtonText: isTeacher ? '' : this.getSecondaryButtonText(mappedStatus, isTeacher),
        teacher_id: apiSession.teacher_id,
        student_id: apiSession.student_id,
        skill_id: apiSession.skill_id,
        scheduled_at: apiSession.scheduled_at,
        created_at: apiSession.created_at,
        updated_at: apiSession.updated_at
      };

      // Fetch partner details asynchronously
      this.loadPartnerDetails(session, partnerId);
      
      return session;
    });
  }

  /**
   * Load partner details for a session
   */
  private loadPartnerDetails(session: Session, partnerId: number): void {
    this.matchesService.getUserProfile(partnerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (partner) => {
          session.partnerName = partner.name;
          session.partnerInitials = this.generateInitials(partner.name);
        },
        error: (error) => {
          console.error('Error loading partner details:', error);
          session.partnerName = 'Unknown User';
          session.partnerInitials = 'UU';
        }
      });
  }

  /**
   * Generate session title based on skill
   */
  private generateSessionTitle(session: SessionResponse): string {
    // In a real app, you'd fetch skill name by skill_id
    return `Session #${session.id}`;
  }

  /**
   * Map API status to component status
   */
  private mapApiStatus(apiStatus: string): 'upcoming' | 'completed' | 'pending' {
    switch (apiStatus.toLowerCase()) {
      case 'confirmed':
      case 'scheduled':
      case 'upcoming':
        return 'upcoming';
      case 'completed':
        return 'completed';
      case 'pending':
      default:
        return 'pending';
    }
  }

  /**
   * Format session time
   */
  private formatSessionTime(scheduledAt: string, status: string): string {
    if (status === 'pending') {
      return 'Waiting for confirmation';
    }

    try {
      const date = new Date(scheduledAt);
      const now = new Date();
      const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (diffInHours < -24) {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        });
      } else if (diffInHours < 0) {
        return 'Yesterday, ' + date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        });
      } else if (diffInHours < 24) {
        return 'Today, ' + date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        });
      } else if (diffInHours < 48) {
        return 'Tomorrow, ' + date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        });
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return scheduledAt;
    }
  }

  /**
   * Get primary button text based on status only
   */
  private getPrimaryButtonText(status: string, isTeacher: boolean): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Accept';
      case 'confirmed':
      case 'scheduled':
      case 'upcoming':
        return 'Join Session';
      case 'completed':
        return 'Book Another';
      default:
        return 'View Details';
    }
  }

  /**
   * Get secondary button text based on status only
   */
  private getSecondaryButtonText(status: string, isTeacher: boolean): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Decline';
      case 'confirmed':
      case 'scheduled':
      case 'upcoming':
        return 'Reschedule';
      case 'completed':
        return 'Message';
      default:
        return 'Message';
    }
  }

  /**
   * Generate initials from name
   */
  private generateInitials(name: string): string {
    if (!name) return 'UU';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return words[0].substring(0, 2).toUpperCase();
  }

  /**
   * Retry loading sessions
   */
  retryLoad(): void {
    this.loadSessions();
  }

  /**
   * Accept a session
   */
  acceptSession(session: Session): void {
    if (this.loading) return;
    
    console.log('Accepting session:', session.id);
    this.loading = true;
    this.error = '';

    this.sessionService.acceptSession(session.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Session accepted successfully:', response);
          console.log('API Response:', JSON.stringify(response, null, 2));
          
          // Update the session status locally
          const sessionIndex = this.sessions.findIndex(s => s.id === session.id);
          if (sessionIndex !== -1) {
            console.log('Updating local session status from', this.sessions[sessionIndex].status, 'to upcoming');
            this.sessions[sessionIndex].status = 'upcoming';
            this.sessions[sessionIndex].primaryButtonText = 'Join Session';
            this.sessions[sessionIndex].secondaryButtonText = 'Reschedule';
            this.sessions[sessionIndex].time = this.formatSessionTime(
              this.sessions[sessionIndex].scheduled_at, 
              'confirmed'
            );
          }
          
          this.loading = false;
          this.notificationService.showSuccess('Session accepted successfully!');
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Failed to accept session. Please try again.';
          console.error('Error accepting session:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          this.notificationService.showError('Failed to accept session: ' + (error.message || 'Unknown error'));
        }
      });
  }

  /**
   * Decline a session
   */
  declineSession(session: Session): void {
    if (this.loading) return;
    
    this.loading = true;
    this.error = '';

    this.sessionService.declineSession(session.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Session declined successfully:', response);
          
          // Remove the session from the list or update its status
          this.sessions = this.sessions.filter(s => s.id !== session.id);
          
          this.loading = false;
          // You can show a success message here if needed
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Failed to decline session. Please try again.';
          console.error('Error declining session:', error);
        }
      });
  }
}
