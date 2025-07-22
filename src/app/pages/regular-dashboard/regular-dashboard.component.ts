import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchCardComponent } from '../../components/matchcard/matchcard.component';

@Component({
  selector: 'app-regular-dashboard',
  templateUrl: './regular-dashboard.component.html',
  styleUrls: ['./regular-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, MatchCardComponent]
})
export class RegularDashboardComponent {} 