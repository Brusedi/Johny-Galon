import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdNewUserMessageComponent } from './sd-new-user-message.component';

describe('SdNewUserMessageComponent', () => {
  let component: SdNewUserMessageComponent;
  let fixture: ComponentFixture<SdNewUserMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdNewUserMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdNewUserMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
