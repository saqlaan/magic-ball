import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerdashboardComponent } from './playerdashboard.component';

describe('PlayerdashboardComponent', () => {
  let component: PlayerdashboardComponent;
  let fixture: ComponentFixture<PlayerdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
