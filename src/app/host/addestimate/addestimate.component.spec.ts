import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddestimateComponent } from './addestimate.component';

describe('AddestimateComponent', () => {
  let component: AddestimateComponent;
  let fixture: ComponentFixture<AddestimateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddestimateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddestimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
