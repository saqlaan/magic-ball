import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { HomeComponent } from './home/home.component';
import {GameComponent} from '@app/game/game.component';
import {SearchgameComponent} from '@app/searchgame/searchgame.component';
import {PlayerComponent} from '@app/player/player.component';
import {PlayerdashboardComponent} from '@app/player/playerdashboard/playerdashboard.component';
import { GamedashboardComponent } from '@app/game/gamedashboard/gamedashboard.component';

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
  {
    path: 'playerdashboard',
   component: PlayerdashboardComponent,
  },
  {
    path: 'gamedashboard',
    component: GamedashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

