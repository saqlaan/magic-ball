import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {SearchgameComponent} from '@app/player/searchgame/searchgame.component';
import {PlayerdashboardComponent} from '@app/player/playerdashboard/playerdashboard.component';
import { GamedashboardComponent } from '@app/host/gamedashboard/gamedashboard.component';
import {AddplayerComponent} from '@app/player/addplayer/addplayer.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
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

