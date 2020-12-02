import { Routes, RouterModule } from '@angular/router';


import { SignupComponent } from './signup/signup.component';
import {GameComponent} from './game/game.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'signup',
        component: SignupComponent,
      },
      {
        path: 'game',
        component: GameComponent,
      },
    ],
  },
];

export const AuthRoutingModule = RouterModule.forChild(routes);
