import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JnWebCntMainNstComponent } from './jn-web-cnt-main-nst.component';

describe('JnWebCntMainNstComponent', () => {
  let component: JnWebCntMainNstComponent;
  let fixture: ComponentFixture<JnWebCntMainNstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JnWebCntMainNstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JnWebCntMainNstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
