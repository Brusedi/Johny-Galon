import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JnAuthComponent } from './jn-auth.component';

describe('JnAuthComponent', () => {
  let component: JnAuthComponent;
  let fixture: ComponentFixture<JnAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JnAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JnAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
