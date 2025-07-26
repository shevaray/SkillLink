import { Component, EventEmitter, Output, Input } from '@angular/core';

interface SchedulerSlot {
  time: string; // e.g. '9am-11am'
  day: string; // e.g. 'Monday'
  date: Date;  // actual date for the day in the current week
  selected: boolean;
}

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent {
  @Input() isDisplayMode: boolean = false; // false = editable, true = display only
  @Input() predefinedAvailability: boolean[][] = []; // for display mode
  @Output() slotSelected = new EventEmitter<SchedulerSlot>();
  @Output() allSelectionsChanged = new EventEmitter<SchedulerSlot[]>(); // for multiple selections

  // Define time slots (3-hour ranges)
  timeSlots: string[] = [
    '9am-11am',
    '11am-1pm',
    '1pm-3pm',
    '3pm-5pm',
    '5pm-7pm',
    '7pm-9pm'
  ];

  // Days of the week
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Days of the week (short)
  daysShort: string[] = ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];

  // Dates for the current week (starting from today)
  weekDates: Date[] = [];

  // Selection state: [time][day] => boolean
  selections: boolean[][] = [];

  constructor() {
    this.initWeekDates();
    this.initSelections();
  }

  // Initialize weekDates to the current week (Monday to Sunday)
  initWeekDates() {
    const today = new Date();
    const first = today.getDate() - today.getDay() + 1; // Monday
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(first + i);
      this.weekDates.push(d);
    }
  }

  // Initialize selections to all false
  initSelections() {
    this.selections = this.timeSlots.map(() => this.days.map(() => false));
  }

  // Handle checkbox click
  onCheckboxChange(timeIdx: number, dayIdx: number) {
    if (this.isDisplayMode) return; // Don't allow changes in display mode
    
    this.selections[timeIdx][dayIdx] = !this.selections[timeIdx][dayIdx];
    const slot: SchedulerSlot = {
      time: this.timeSlots[timeIdx],
      day: this.days[dayIdx],
      date: this.weekDates[dayIdx],
      selected: this.selections[timeIdx][dayIdx]
    };
    this.slotSelected.emit(slot);
    
    // Emit all current selections
    this.emitAllSelections();
    
    console.log('Selected:', slot);
  }

  // Emit all current selections
  emitAllSelections() {
    const allSelections: SchedulerSlot[] = [];
    for (let t = 0; t < this.timeSlots.length; t++) {
      for (let d = 0; d < this.days.length; d++) {
        if (this.selections[t][d]) {
          allSelections.push({
            time: this.timeSlots[t],
            day: this.days[d],
            date: this.weekDates[d],
            selected: true
          });
        }
      }
    }
    this.allSelectionsChanged.emit(allSelections);
    // Log all selected days as you select
    console.log('All selected slots:', allSelections.map(sel => ({ day: sel.day, time: sel.time, date: sel.date })));
  }

  // Get selections for display mode
  getDisplaySelections(): boolean[][] {
    return this.isDisplayMode ? this.predefinedAvailability : this.selections;
  }
}
