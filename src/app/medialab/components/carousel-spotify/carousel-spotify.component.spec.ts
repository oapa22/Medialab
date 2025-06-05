import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselSpotifyComponent } from './carousel-spotify.component';

describe('CarouselSpotifyComponent', () => {
  let component: CarouselSpotifyComponent;
  let fixture: ComponentFixture<CarouselSpotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarouselSpotifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselSpotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
