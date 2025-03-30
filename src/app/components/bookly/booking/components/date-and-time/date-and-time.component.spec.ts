import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateAndTimeComponent } from './date-and-time.component';

describe('DateAndTimeComponent', () => {
  let component: DateAndTimeComponent;
  let fixture: ComponentFixture<DateAndTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DateAndTimeComponent]
    });
    fixture = TestBed.createComponent(DateAndTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
