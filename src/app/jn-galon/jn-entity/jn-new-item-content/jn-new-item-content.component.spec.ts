import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JnNewItemContentComponent } from './jn-new-item-content.component';

describe('JnNewItemContentComponent', () => {
  let component: JnNewItemContentComponent;
  let fixture: ComponentFixture<JnNewItemContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JnNewItemContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JnNewItemContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
