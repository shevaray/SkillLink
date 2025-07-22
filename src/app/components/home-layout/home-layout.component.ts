import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FirstTimeUserComponent } from '../../pages/firsttimeuser/firsttimeuser.component';
import { UserService } from '../../services/user.service';
import { RegularDashboardComponent } from '../../pages/regular-dashboard/regular-dashboard.component';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, FirstTimeUserComponent, RegularDashboardComponent]
})
export class HomeLayoutComponent {
  constructor(public userService: UserService) {}
} 