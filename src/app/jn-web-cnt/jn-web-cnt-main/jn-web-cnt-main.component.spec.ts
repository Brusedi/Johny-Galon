import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JnWebCntMainComponent } from './jn-web-cnt-main.component';

describe('JnWebCntMainComponent', () => {
  let component: JnWebCntMainComponent;
  let fixture: ComponentFixture<JnWebCntMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JnWebCntMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JnWebCntMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
