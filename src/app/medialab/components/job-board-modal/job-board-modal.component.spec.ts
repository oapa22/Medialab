import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobBoardModalComponent } from './job-board-modal.component';

describe('JobBoardModalComponent', () => {
  let component: JobBoardModalComponent;
  let fixture: ComponentFixture<JobBoardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobBoardModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobBoardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
