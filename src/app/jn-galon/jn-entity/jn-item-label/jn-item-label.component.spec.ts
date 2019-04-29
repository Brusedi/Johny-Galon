import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JnItemLabelComponent } from './jn-item-label.component';

describe('JnItemLabelComponent', () => {
  let component: JnItemLabelComponent;
  let fixture: ComponentFixture<JnItemLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JnItemLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JnItemLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
