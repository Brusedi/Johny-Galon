import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JnAuthSelectorComponent } from './jn-auth-selector.component';

describe('JnAuthSelectorComponent', () => {
  let component: JnAuthSelectorComponent;
  let fixture: ComponentFixture<JnAuthSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JnAuthSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JnAuthSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
