import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JnWebCntItemComponent } from './jn-web-cnt-item.component';

describe('JnWebCntItemComponent', () => {
  let component: JnWebCntItemComponent;
  let fixture: ComponentFixture<JnWebCntItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JnWebCntItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JnWebCntItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
