import { Component, OnInit } from '@angular/core';

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
  notifications: Notification[] = [
    {
      id: 'dj-exchange',
      initials: 'DJ',
      message: 'David Johnson wants to exchange skill with you',
      time: '5 minutes ago',
      isNew: true
    },
    {
      id: 'lk-session',
      initials: 'LK',
      message: 'Lisa Kim scheduled a session for tomorrow at 3PM',
      time: '1 hour ago'
    },
    {
      id: 'aj-completed',
      initials: 'AJ',
      message: 'Alex Johnson completed your python session',
      time: '1 day ago'
    },
    {
      id: 'mr-message-1',
      initials: 'MR',
      message: 'Mike Rodriguez sent you a message',
      time: '2 days ago'
    },
    {
      id: 'mr-message-2',
      initials: 'MR',
      message: 'Mike Rodriguez sent you a message',
      time: '20 minutes ago'
    }
  ];

  constructor() { }

  ngOnInit(): void {}

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
