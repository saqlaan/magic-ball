import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnacceptableComponent } from './unacceptable.component';

describe('UnacceptableComponent', () => {
  let component: UnacceptableComponent;
  let fixture: ComponentFixture<UnacceptableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnacceptableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnacceptableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
