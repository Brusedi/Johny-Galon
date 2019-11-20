import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JnpFlightItemComponent } from './jnp-flight-item.component';

describe('JnpFlightItemComponent', () => {
  let component: JnpFlightItemComponent;
  let fixture: ComponentFixture<JnpFlightItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JnpFlightItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JnpFlightItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
