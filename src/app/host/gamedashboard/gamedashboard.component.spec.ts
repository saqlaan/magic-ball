import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamedashboardComponent } from './gamedashboard.component';

describe('GamedashboardComponent', () => {
  let component: GamedashboardComponent;
  let fixture: ComponentFixture<GamedashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamedashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamedashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
