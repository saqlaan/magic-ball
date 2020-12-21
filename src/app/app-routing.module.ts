import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {SearchgameComponent} from '@app/player/searchgame/searchgame.component';
import {PlayerdashboardComponent} from '@app/player/playerdashboard/playerdashboard.component';
import { GamedashboardComponent } from '@app/host/gamedashboard/gamedashboard.component';
import {AddplayerComponent} from '@app/player/addplayer/addplayer.component';
import {SignupComponent} from '@app/host/signup/signup.component';
import {LoginComponent} from '@app/host/login/login.component';
import {UpdateprofileComponent} from '@app/host/updateprofile/updateprofile.component';
import {LoginhelpComponent} from '@app/host/loginhelp/loginhelp.component';
import {HomescreenComponent} from '@app/host/homescreen/homescreen.component';

const routes: Routes = [
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
  {
  path: 'hostsignup',
    component: SignupComponent
  },
  {
    path: 'hostlogin',
    component: LoginComponent
  },
  {
    path: 'hostloginhelp',
    component: LoginhelpComponent
  },
  {
    path: 'hostupdateprofile',
    component: UpdateprofileComponent
  },
  {
    path: '',
    component: HomescreenComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}

