import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

export interface Actor {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  about_me: string;
  teaching_style: string;
  skill_level: string;
  profile_picture_path: string | null;
  availability: string;
}

export interface NotificationData {
  session_id?: number;
  student_name?: string;
  [key: string]: any;
}

export interface BackendNotification {
  id: number;
  user_id: number;
  actor_id: number;
  type: 'session_request' | 'session_accepted' | 'session_declined' | 'session_update';
  data: NotificationData;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  actor: Actor;
}

export interface Notification {
  id: string;
  initials: string;
  message: string;
  time: string;
  isNew?: boolean;
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    const token = this.authService.getToken();
    
    if (!token) {
      this.loading = false;
      return;
    }

    this.http.get<BackendNotification[]>(`${environment.apiUrl}/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      }
    }).subscribe({
      next: (backendNotifications) => {
        this.notifications = backendNotifications.map(notification => this.transformNotification(notification));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.loading = false;
      }
    });
  }

  private transformNotification(backendNotification: BackendNotification): Notification {
    const message = this.generateMessage(backendNotification);
    const initials = this.getInitials(backendNotification.actor.name);
    const timeAgo = this.getTimeAgo(backendNotification.created_at);
    
    return {
      id: backendNotification.id.toString(),
      initials,
      message,
      time: timeAgo,
      isNew: !backendNotification.read_at
    };
  }

  private generateMessage(notification: BackendNotification): string {
    const actorName = notification.actor.name;
    
    switch (notification.type) {
      case 'session_request':
        return `${actorName} scheduled a session for tomorrow at 3PM`;
      
      case 'session_accepted':
        return `${actorName} accepted your session request`;
      
      case 'session_declined':
        return `${actorName} declined your session request`;
      
      case 'session_update':
        return `${actorName} updated your session details`;
      
      default:
        return `${actorName} sent you a notification`;
    }
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  private getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  onMoreOptionsClick(event: Event): void {
    event.stopPropagation();
    // Add your logic here for handling more options
    console.log('More options clicked');
  }

  onNotificationClick(notificationId: string): void {
    // Add your logic here for handling notification clicks
    console.log('Notification clicked:', notificationId);
  }
}
