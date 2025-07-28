import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptSessionComponent } from './accept-session.component';

describe('AcceptSessionComponent', () => {
  let component: AcceptSessionComponent;
  let fixture: ComponentFixture<AcceptSessionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcceptSessionComponent]
    });
    fixture = TestBed.createComponent(AcceptSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
