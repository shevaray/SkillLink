import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountMenuComponent } from '../account-menu/account-menu.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, AccountMenuComponent]
})
export class NavbarComponent {
  @Input() userName: string = 'John Doe';
  @Input() userAvatar: string = 'https://ui-avatars.com/api/?name=User';
  @Input() notificationCount: number = 3;

  showAccountMenu = false;

  openAccountMenu() {
    this.showAccountMenu = true;
  }
  closeAccountMenu() {
    this.showAccountMenu = false;
  }
} 