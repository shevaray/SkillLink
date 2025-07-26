import { Component, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss'],
  standalone: true,
  imports: [RouterModule]
})
export class AccountMenuComponent {
  @Output() close = new EventEmitter<void>();
} 