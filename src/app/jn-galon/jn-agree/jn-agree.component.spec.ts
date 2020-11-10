import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JnAgreeComponent } from './jn-agree.component';

describe('JnAgreeComponent', () => {
  let component: JnAgreeComponent;
  let fixture: ComponentFixture<JnAgreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JnAgreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JnAgreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
