import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoBookingFoundComponent } from './no-booking-found.component';

describe('NoBookingFoundComponent', () => {
  let component: NoBookingFoundComponent;
  let fixture: ComponentFixture<NoBookingFoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoBookingFoundComponent]
    });
    fixture = TestBed.createComponent(NoBookingFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
