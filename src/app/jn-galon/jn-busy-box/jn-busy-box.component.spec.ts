import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JnBusyBoxComponent } from './jn-busy-box.component';

describe('JnBusyBoxComponent', () => {
  let component: JnBusyBoxComponent;
  let fixture: ComponentFixture<JnBusyBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JnBusyBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JnBusyBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
