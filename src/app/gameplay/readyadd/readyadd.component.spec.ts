import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyaddComponent } from './readyadd.component';

describe('ReadyaddComponent', () => {
  let component: ReadyaddComponent;
  let fixture: ComponentFixture<ReadyaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadyaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadyaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
