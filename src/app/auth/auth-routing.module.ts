import { Routes, RouterModule } from '@angular/router';


import { SignupComponent } from './signup/signup.component';
import {GameComponent} from '../game/game.component';
import { SearchgameComponent } from '../searchgame/searchgame.component';
import { Component } from '@angular/core';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'signup',
        component: SignupComponent,
      },
      {
        path: 'searchgame',
        component: SearchgameComponent,
      },
      {
        path: 'game',
        component: GameComponent,
      },
    ],
  },
];

export const AuthRoutingModule = RouterModule.forChild(routes);
