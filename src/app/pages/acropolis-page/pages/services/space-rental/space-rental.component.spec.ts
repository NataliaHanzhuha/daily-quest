import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceRentalComponent } from './space-rental.component';

describe('SpaceRentalComponent', () => {
  let component: SpaceRentalComponent;
  let fixture: ComponentFixture<SpaceRentalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SpaceRentalComponent]
    });
    fixture = TestBed.createComponent(SpaceRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
