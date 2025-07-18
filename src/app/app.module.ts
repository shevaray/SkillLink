import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VerifyEmailComponent } from './onboarding/verify-email/verify-email.component';
import { EmailConfirmedComponent } from './onboarding/email-confirmed/email-confirmed.component';
import { ResetSentComponent } from './onboarding/reset-sent/reset-sent.component';
import { ResetSuccessComponent } from './onboarding/reset-success/reset-success.component';

@NgModule({
  declarations: [
    AppComponent,
    VerifyEmailComponent,
    EmailConfirmedComponent,
    ResetSentComponent,
    ResetSuccessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
