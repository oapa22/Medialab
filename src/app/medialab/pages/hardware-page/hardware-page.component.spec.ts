import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwarePageComponent } from './hardware-page.component';

describe('HardwarePageComponent', () => {
  let component: HardwarePageComponent;
  let fixture: ComponentFixture<HardwarePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HardwarePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HardwarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
