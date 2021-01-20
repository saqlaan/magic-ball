import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodroundComponent } from './goodround.component';

describe('GoodroundComponent', () => {
  let component: GoodroundComponent;
  let fixture: ComponentFixture<GoodroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
