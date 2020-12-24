import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingplayersComponent } from './waitingplayers.component';

describe('WaitingplayersComponent', () => {
  let component: WaitingplayersComponent;
  let fixture: ComponentFixture<WaitingplayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingplayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingplayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
