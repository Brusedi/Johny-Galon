import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrochIconSvgComponent } from './droch-icon-svg.component';

describe('DrochIconSvgComponent', () => {
  let component: DrochIconSvgComponent;
  let fixture: ComponentFixture<DrochIconSvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrochIconSvgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrochIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
