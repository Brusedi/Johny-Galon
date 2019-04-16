import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JnInfoBoxComponent } from './jn-info-box.component';

describe('JnInfoBoxComponent', () => {
  let component: JnInfoBoxComponent;
  let fixture: ComponentFixture<JnInfoBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JnInfoBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JnInfoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
