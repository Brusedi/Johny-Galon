import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JgHomeComponent } from './jg-home.component';

describe('JgHomeComponent', () => {
  let component: JgHomeComponent;
  let fixture: ComponentFixture<JgHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JgHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JgHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
