import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { HomeComponent } from './home/home.component';
import {GameComponent} from '@app/game/game.component';
import {SearchgameComponent} from '@app/searchgame/searchgame.component';
import {PlayerComponent} from '@app/player/player.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'host',
    component: GameComponent,

  },
  {
    path: 'player',
    component: PlayerComponent,

  },
  {
    path: 'searchgame',
    component: SearchgameComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

