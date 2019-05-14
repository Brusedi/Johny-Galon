import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrochIconComponent } from './droch-icon.component';

describe('DrochIconComponent', () => {
  let component: DrochIconComponent;
  let fixture: ComponentFixture<DrochIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrochIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrochIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
