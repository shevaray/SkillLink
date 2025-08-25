import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountMenuComponent } from '../account-menu/account-menu.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AccountMenuComponent]
})
export class NavbarComponent {
  @Input() userName: string = 'John Doe';
  @Input() userAvatar: string = 'https://ui-avatars.com/api/?name=User';
  @Input() notificationCount: number = 3;

  showAccountMenu = false;
  searchQuery = '';

  constructor(private router: Router) {}

  openAccountMenu() {
    this.showAccountMenu = true;
  }
  
  closeAccountMenu() {
    this.showAccountMenu = false;
  }

  performSearch() {
    if (this.searchQuery.trim()) {
      // Navigate to search page with query
      this.router.navigate(['/home/search'], { 
        queryParams: { q: this.searchQuery.trim() } 
      });
    } else {
      // Navigate to search page without query
      this.router.navigate(['/home/search']);
    }
  }
} 