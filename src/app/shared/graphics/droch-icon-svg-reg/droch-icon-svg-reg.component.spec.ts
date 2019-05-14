import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrochIconSvgRegComponent } from './droch-icon-svg-reg.component';

describe('DrochIconSvgRegComponent', () => {
  let component: DrochIconSvgRegComponent;
  let fixture: ComponentFixture<DrochIconSvgRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrochIconSvgRegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrochIconSvgRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
