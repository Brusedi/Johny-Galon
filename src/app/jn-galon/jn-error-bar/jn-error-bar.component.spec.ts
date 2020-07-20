import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JnErrorBarComponent } from './jn-error-bar.component';

describe('JnErrorBarComponent', () => {
  let component: JnErrorBarComponent;
  let fixture: ComponentFixture<JnErrorBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JnErrorBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JnErrorBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
