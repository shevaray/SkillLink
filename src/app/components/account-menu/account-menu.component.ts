import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss'],
  standalone: true
})
export class AccountMenuComponent {
  @Output() close = new EventEmitter<void>();
} 