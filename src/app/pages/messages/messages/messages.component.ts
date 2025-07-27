import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Message {
  id: string;
  senderName: string;
  senderAvatar: string;
  preview: string;
  date: string;
  isActive: boolean;
  isOnline: boolean;
}

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  isReceived: boolean;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [
    {
      id: '1',
      senderName: 'Linda Smith',
      senderAvatar: '/assets/human-pic.png',
      preview: 'Dear Sarah, I hope this message find..',
      date: 'Nov 6, 2024',
      isActive: false,
      isOnline: true
    },
    {
      id: '2',
      senderName: 'Marcus Rodriguez',
      senderAvatar: '/assets/human-pic.png',
      preview: 'Hi! I saw your profile and I\'m interested...',
      date: 'Nov 5, 2024',
      isActive: false,
      isOnline: false
    },
    {
      id: '3',
      senderName: 'Emily Johnson',
      senderAvatar: '/assets/human-pic.png',
      preview: 'Thanks for the session yesterday! It was...',
      date: 'Nov 4, 2024',
      isActive: false,
      isOnline: true
    },
    {
      id: '4',
      senderName: 'David Chen',
      senderAvatar: '/assets/human-pic.png',
      preview: 'Are you available for a guitar lesson this...',
      date: 'Nov 3, 2024',
      isActive: false,
      isOnline: false
    },
    {
      id: '5',
      senderName: 'Sarah Wilson',
      senderAvatar: '/assets/human-pic.png',
      preview: 'I\'d love to learn photography from you...',
      date: 'Nov 2, 2024',
      isActive: false,
      isOnline: true
    }
  ];

  chatMessages: ChatMessage[] = [
    {
      id: '1',
      content: `Hi, Emily

I'm Linda, and I noticed you are looking to learn guitar. I'd love to help you with that!

In exchange, I'm hoping to learn photography, which I can see you offer.

Would be interested in setting up a skill exchange session? I am flexible with timing and can start with a quick intro call to see if we are a good match.`,
      timestamp: 'November 6, 2024',
      isReceived: true
    }
  ];

  selectedMessage: Message | null = null;
  newMessageText: string = '';

  constructor() { }

  ngOnInit(): void {
    // No default selection - user must click to select
  }

  selectMessage(message: Message): void {
    // Clear previous active state
    this.messages.forEach(msg => msg.isActive = false);
    
    // Set new active state
    message.isActive = true;
    this.selectedMessage = message;
    
    // Load chat messages for this conversation
    this.loadChatMessages(message.id);
    
    console.log('Selected message:', message);
  }

  private loadChatMessages(messageId: string): void {
    // Simulate loading different chat messages based on the selected message
    switch(messageId) {
      case '1':
        this.chatMessages = [
          {
            id: '1',
            content: `Hi, Emily

I'm Linda, and I noticed you are looking to learn guitar. I'd love to help you with that!

In exchange, I'm hoping to learn photography, which I can see you offer.

Would be interested in setting up a skill exchange session? I am flexible with timing and can start with a quick intro call to see if we are a good match.`,
            timestamp: 'November 6, 2024',
            isReceived: true
          }
        ];
        break;
      case '2':
        this.chatMessages = [
          {
            id: '2',
            content: `Hi! I saw your profile and I'm interested in learning JavaScript from you. I can offer Spanish lessons in exchange.

I'm a native Spanish speaker and have been teaching for 3 years. Would you be interested in a skill exchange?`,
            timestamp: 'November 5, 2024',
            isReceived: true
          },
          {
            id: '3',
            content: `That sounds great! I'd love to learn Spanish. When are you available for our first session?`,
            timestamp: 'November 5, 2024',
            isReceived: false
          }
        ];
        break;
      case '3':
        this.chatMessages = [
          {
            id: '4',
            content: `Thanks for the session yesterday! It was really helpful. I learned so much about React hooks.`,
            timestamp: 'November 4, 2024',
            isReceived: true
          },
          {
            id: '5',
            content: `You're welcome! You're a great student. Looking forward to our next session.`,
            timestamp: 'November 4, 2024',
            isReceived: false
          },
          {
            id: '6',
            content: `Same here! When can we schedule the next one?`,
            timestamp: 'November 4, 2024',
            isReceived: true
          }
        ];
        break;
      case '4':
        this.chatMessages = [
          {
            id: '7',
            content: `Are you available for a guitar lesson this weekend? I can teach you some basic chords.`,
            timestamp: 'November 3, 2024',
            isReceived: true
          },
          {
            id: '8',
            content: `Yes, I'm free on Saturday afternoon. What time works for you?`,
            timestamp: 'November 3, 2024',
            isReceived: false
          },
          {
            id: '9',
            content: `How about 2 PM? I can come to your place or we can meet at a coffee shop.`,
            timestamp: 'November 3, 2024',
            isReceived: true
          }
        ];
        break;
      case '5':
        this.chatMessages = [
          {
            id: '10',
            content: `I'd love to learn photography from you! I can offer cooking lessons in exchange.`,
            timestamp: 'November 2, 2024',
            isReceived: true
          },
          {
            id: '11',
            content: `That sounds perfect! I love cooking. What type of cuisine do you specialize in?`,
            timestamp: 'November 2, 2024',
            isReceived: false
          },
          {
            id: '12',
            content: `I'm good with Italian and Mexican dishes. We can start with pasta making!`,
            timestamp: 'November 2, 2024',
            isReceived: true
          }
        ];
        break;
      default:
        this.chatMessages = [];
    }
  }

  sendMessage(): void {
    if (this.newMessageText.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content: this.newMessageText,
        timestamp: new Date().toLocaleDateString(),
        isReceived: false
      };
      
      this.chatMessages.push(newMessage);
      this.newMessageText = '';
      
      console.log('Message sent:', newMessage);
    }
  }

  onComposeClick(): void {
    console.log('Compose new message clicked');
    // In a real app, this would open a compose modal or navigate to compose page
  }

  onBlockUser(): void {
    console.log('Block user clicked');
    // In a real app, this would block the current user
  }

  onDeleteChat(): void {
    console.log('Delete chat clicked');
    // In a real app, this would delete the current conversation
  }

  onSearchMessages(event: any): void {
    const searchTerm = event.target.value;
    console.log('Searching for:', searchTerm);
    // In a real app, this would filter messages based on search term
  }
}
