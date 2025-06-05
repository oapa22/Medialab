import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobBoardPageComponent } from './job-board-page.component';

describe('JobBoardPageComponent', () => {
  let component: JobBoardPageComponent;
  let fixture: ComponentFixture<JobBoardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobBoardPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobBoardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
