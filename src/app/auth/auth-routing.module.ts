import {RouterModule, Routes} from '@angular/router';


import {SearchgameComponent} from '../player/searchgame/searchgame.component';

const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: 'searchgame',
        component: SearchgameComponent,
      },
    ],
  },
];

export const AuthRoutingModule = RouterModule.forChild(routes);
