import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundresultComponent } from './roundresult.component';

describe('RoundresultComponent', () => {
  let component: RoundresultComponent;
  let fixture: ComponentFixture<RoundresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
