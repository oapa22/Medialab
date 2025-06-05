import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceReservationPageComponent } from './space-reservation-page.component';

describe('SpaceReservationPageComponent', () => {
  let component: SpaceReservationPageComponent;
  let fixture: ComponentFixture<SpaceReservationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaceReservationPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceReservationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
