import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalresultComponent } from './finalresult.component';

describe('FinalresultComponent', () => {
  let component: FinalresultComponent;
  let fixture: ComponentFixture<FinalresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
