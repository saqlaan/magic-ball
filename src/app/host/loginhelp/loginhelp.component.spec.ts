import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginhelpComponent } from './loginhelp.component';

describe('LoginhelpComponent', () => {
  let component: LoginhelpComponent;
  let fixture: ComponentFixture<LoginhelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginhelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginhelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
