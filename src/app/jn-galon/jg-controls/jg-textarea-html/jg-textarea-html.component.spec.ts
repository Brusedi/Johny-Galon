import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JgTextareaHtmlComponent } from './jg-textarea-html.component';

describe('JgTextareaHtmlComponent', () => {
  let component: JgTextareaHtmlComponent;
  let fixture: ComponentFixture<JgTextareaHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JgTextareaHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JgTextareaHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
