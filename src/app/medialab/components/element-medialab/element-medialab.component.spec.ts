import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementMedialabComponent } from './element-medialab.component';

describe('ElementMedialabComponent', () => {
  let component: ElementMedialabComponent;
  let fixture: ComponentFixture<ElementMedialabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElementMedialabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementMedialabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
