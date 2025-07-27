import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VerifyEmailComponent } from './onboarding/verify-email/verify-email.component';
import { EmailConfirmedComponent } from './onboarding/email-confirmed/email-confirmed.component';
import { ResetSentComponent } from './onboarding/reset-sent/reset-sent.component';
import { ResetSuccessComponent } from './onboarding/reset-success/reset-success.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { SessionsComponent } from './pages/sessions/sessions.component';
import { JoinSessionComponent } from './components/join-session/join-session.component';
import { AcceptSessionComponent } from './components/accept-session/accept-session.component';
import { PublicProfileComponent } from './pages/public-profile/public-profile.component';
import { SharedModule } from './shared/shared.module';
import { ScheduleSessionComponent } from './pages/schedule-session/schedule-session.component';

@NgModule({
  declarations: [
    AppComponent,
    VerifyEmailComponent,
    EmailConfirmedComponent,
    ResetSentComponent,
    ResetSuccessComponent,
    NotificationComponent,
    SessionsComponent,
    JoinSessionComponent,
    AcceptSessionComponent,
    PublicProfileComponent,
    ScheduleSessionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
