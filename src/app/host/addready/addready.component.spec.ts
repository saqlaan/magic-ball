import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddreadyComponent } from './addready.component';

describe('AddreadyComponent', () => {
  let component: AddreadyComponent;
  let fixture: ComponentFixture<AddreadyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddreadyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddreadyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
