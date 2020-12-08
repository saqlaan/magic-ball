import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { HomeComponent } from './home/home.component';
import {AddgameComponent} from '@app/host/addgame/addgame.component';
import {SearchgameComponent} from '@app/player/searchgame/searchgame.component';
import {AddplayerComponent} from '@app/player/addplayer/addplayer.component';
import {PlayerdashboardComponent} from '@app/player/playerdashboard/playerdashboard.component';
import { GamedashboardComponent } from '@app/host/gamedashboard/gamedashboard.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'host',
    component: AddgameComponent,

  },
  {
    path: 'player',
    component: AddplayerComponent,

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

