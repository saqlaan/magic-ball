import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamenotfoundComponent } from './gamenotfound.component';

describe('GamenotfoundComponent', () => {
  let component: GamenotfoundComponent;
  let fixture: ComponentFixture<GamenotfoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamenotfoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamenotfoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
