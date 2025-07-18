import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-sent',
  templateUrl: './reset-sent.component.html',
  styleUrls: ['./reset-sent.component.scss']
})
export class ResetSentComponent implements OnInit, OnDestroy {
  countdown = 5;
  private intervalId: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(this.intervalId);
        this.router.navigate(['/onboarding/reset-password']);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
