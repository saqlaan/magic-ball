import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SearchgameComponent} from '@app/player/searchgame/searchgame.component';
import {PlayerdashboardComponent} from '@app/player/playerdashboard/playerdashboard.component';
import {GamedashboardComponent} from '@app/host/gamedashboard/gamedashboard.component';
import {AddplayerComponent} from '@app/player/addplayer/addplayer.component';
import {SignupComponent} from '@app/host/signup/signup.component';
import {LoginComponent} from '@app/host/login/login.component';
import {UpdateprofileComponent} from '@app/host/updateprofile/updateprofile.component';
import {LoginhelpComponent} from '@app/host/loginhelp/loginhelp.component';
import {HomescreenComponent} from '@app/host/homescreen/homescreen.component';
import {DashboardComponent} from '@app/host/dashboard/dashboard.component';
import {ResetpasswordComponent} from '@app/host/resetpassword/resetpassword.component';
import {MessageComponent} from '@app/host/message/message.component';
import {GamesettingsComponent} from '@app/host/gamesettings/gamesettings.component';
import {WaitingplayersComponent} from '@app/host/waitingplayers/waitingplayers.component';
import {UpdatepasswordComponent} from '@app/host/updatepassword/updatepassword.component';
import { AuthGuard } from './shared/guards/auth.guard';
import {AddplanComponent} from '@app/host/addplan/addplan.component';
import {AddestimateComponent} from '@app/host/addestimate/addestimate.component';
import {AddreadyComponent} from '@app/host/addready/addready.component';
import {FinalresultComponent} from '@app/host/finalresult/finalresult.component';
import {GameplayComponent} from '@app/host/gameplay/gameplay.component';
import {RoundresultComponent} from '@app/host/roundresult/roundresult.component';
import {loggedInGuard} from '@app/shared/guards/loggedin.guard';
import {EstimateComponent} from '@app/gameplay/estimate/estimate.component';
import {ResultroundComponent} from '@app/gameplay/resultround/resultround.component';
import {PlaygameComponent} from '@app/gameplay/playgame/playgame.component';
import {PlanningComponent} from '@app/gameplay/planning/planning.component';
import {GoodroundComponent} from '@app/gameplay/goodround/goodround.component';
import {MainComponent} from '@app/gameplay/main/main.component';
import {ReadyaddComponent} from '@app/gameplay/readyadd/readyadd.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [loggedInGuard],
    component: HomescreenComponent
  },
  {
    path: 'hostdashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent
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
    path: 'addplan',
    component: AddplanComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'finalresult',
    component: FinalresultComponent,
    canActivate: [AuthGuard],
  }, {
    path: 'gameplay',
    component: GameplayComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'addready',
    component: AddreadyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'addestimate',
    component: AddestimateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'roundresult',
    component: RoundresultComponent,
    canActivate: [AuthGuard],
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
    canActivate: [loggedInGuard],
    component: SignupComponent
  },
  {
    path: 'hostlogin',
    canActivate: [loggedInGuard],
    component: LoginComponent
  },
  {
    path: 'hostloginhelp',
    canActivate: [loggedInGuard],
    component: LoginhelpComponent
  },
  {
    path: 'hostupdateprofile',
    component: UpdateprofileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'hostresetpassword',
    canActivate: [loggedInGuard],
    component: ResetpasswordComponent
  },
  {
    path: 'successmessage',
    component: MessageComponent,
  },
  {
    path: 'gamesettings',
    component: GamesettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'waitingplayers',
    canActivate: [AuthGuard],
    component: WaitingplayersComponent
  },
  {
    path: 'updatepassword',
    canActivate: [AuthGuard],
    component: UpdatepasswordComponent
  },{
    path: 'game/:gameCode',
    component: MainComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {
}

