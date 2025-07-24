import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-matchcard',
  templateUrl: './matchcard.component.html',
  styleUrls: ['./matchcard.component.scss'],
  standalone: true
})
export class MatchCardComponent {
  @Input() initials: string = 'MR';
  @Input() name: string = 'Marcus Rodriguez';
  @Input() matchLabel: string = 'Perfect Match!';
  @Input() teaches: string = 'Photography';
  @Input() description: string = 'Full stack developer with 5+ years experience. I can help build modern web applications from scratch.';
  @Input() wantsToLearn: string = 'Guitar';
} 