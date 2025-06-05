import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionScheduleComponent } from './section-schedule.component';

describe('SectionScheduleComponent', () => {
  let component: SectionScheduleComponent;
  let fixture: ComponentFixture<SectionScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
