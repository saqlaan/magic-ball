import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultroundComponent } from './resultround.component';

describe('ResultroundComponent', () => {
  let component: ResultroundComponent;
  let fixture: ComponentFixture<ResultroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
