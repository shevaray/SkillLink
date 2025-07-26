import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerComponent } from '../components/scheduler/scheduler.component';
import { ConnectModalComponent } from '../components/connect-modal/connect-modal.component';

@NgModule({
  declarations: [
    SchedulerComponent,
    ConnectModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SchedulerComponent,
    ConnectModalComponent
  ]
})
export class SharedModule { }
