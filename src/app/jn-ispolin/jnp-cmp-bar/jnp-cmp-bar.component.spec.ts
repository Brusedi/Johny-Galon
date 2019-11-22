import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JnpCmpBarComponent } from './jnp-cmp-bar.component';

describe('JnpCmpBarComponent', () => {
  let component: JnpCmpBarComponent;
  let fixture: ComponentFixture<JnpCmpBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JnpCmpBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JnpCmpBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
