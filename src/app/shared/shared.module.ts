import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerComponent } from '../components/scheduler/scheduler.component';

@NgModule({
  declarations: [
    SchedulerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SchedulerComponent
  ]
})
export class SharedModule { }
