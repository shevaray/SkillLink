import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingShell } from './onboarding/onboarding-shell/onboarding-shell';
import { Register } from './onboarding/register/register';
import { VerifyEmailComponent } from './onboarding/verify-email/verify-email.component';
import { EmailConfirmedComponent } from './onboarding/email-confirmed/email-confirmed.component';
import { LoginComponent } from './onboarding/login/login.component';
import { ForgotPasswordComponent } from './onboarding/forgot-password/forgot-password.component';
import { ResetSentComponent } from './onboarding/reset-sent/reset-sent.component';
import { ResetPasswordComponent } from './onboarding/reset-password/reset-password.component';
import { ResetSuccessComponent } from './onboarding/reset-success/reset-success.component';
import { HomeLayoutComponent } from './components/home-layout/home-layout.component';
import { FirstTimeUserComponent } from './pages/firsttimeuser/firsttimeuser.component';

const routes: Routes = [
  {
    path: 'onboarding',
    component: OnboardingShell,
    children: [
      { path: 'register', component: Register },
      { path: 'verify-email', component: VerifyEmailComponent },
      { path: 'email-confirmed', component: EmailConfirmedComponent },
      { path: 'login', component: LoginComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-sent', component: ResetSentComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'reset-success', component: ResetSuccessComponent },
      { path: '', redirectTo: 'register', pathMatch: 'full' }
    ]
  },
  {
    path: 'home',
    component: HomeLayoutComponent,
    children: [
      { path: 'firsttimeuser', component: FirstTimeUserComponent }
    ]
  },
  {
    path: 'register',
    redirectTo: 'onboarding/register',
    pathMatch: 'full'
  },
  { path: '', redirectTo: 'onboarding/register', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
