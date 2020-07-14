import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JnRiskExamComponent } from './jn-risk-exam.component';

describe('JnRiskExamComponent', () => {
  let component: JnRiskExamComponent;
  let fixture: ComponentFixture<JnRiskExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JnRiskExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JnRiskExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
