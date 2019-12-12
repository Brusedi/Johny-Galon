import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JnNameplateCardComponent } from './jn-nameplate-card.component';

describe('JnNameplateCardComponent', () => {
  let component: JnNameplateCardComponent;
  let fixture: ComponentFixture<JnNameplateCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JnNameplateCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JnNameplateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
