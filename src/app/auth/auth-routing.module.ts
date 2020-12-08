import { Routes, RouterModule } from '@angular/router';


import { SignupComponent } from './signup/signup.component';
import { SearchgameComponent } from '../player/searchgame/searchgame.component';
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
    ],
  },
];

export const AuthRoutingModule = RouterModule.forChild(routes);
