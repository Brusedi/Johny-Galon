import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JnBusyBarComponent } from './jn-busy-bar.component';

describe('JnBusyBarComponent', () => {
  let component: JnBusyBarComponent;
  let fixture: ComponentFixture<JnBusyBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JnBusyBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JnBusyBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
