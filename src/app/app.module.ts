 import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {SharedModule} from './shared/shared.module';
import {AppComponent} from './app.component';
import {AuthHeaderInterceptor} from './interceptors/header.interceptor';
import {CatchErrorInterceptor} from './interceptors/http-error.interceptor';

import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './home/home.component';
import {SearchgameComponent} from './player/searchgame/searchgame.component';
import {PlayerdashboardComponent} from './player/playerdashboard/playerdashboard.component';
import {GamedashboardComponent} from './host/gamedashboard/gamedashboard.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {AddplayerComponent} from './player/addplayer/addplayer.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SignupComponent} from './host/signup/signup.component';
import {LoginComponent} from './host/login/login.component';
import {UpdateprofileComponent} from './host/updateprofile/updateprofile.component';
import {LoginhelpComponent} from './host/loginhelp/loginhelp.component';
import {HomescreenComponent} from './host/homescreen/homescreen.component';
import {DashboardComponent} from './host/dashboard/dashboard.component';
import {ResetpasswordComponent} from './host/resetpassword/resetpassword.component';
import {MessageComponent} from './host/message/message.component';
import {GamesettingsComponent} from './host/gamesettings/gamesettings.component';
import {WaitingplayersComponent} from './host/waitingplayers/waitingplayers.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {UpdatepasswordComponent} from './host/updatepassword/updatepassword.component';
import {ToastrModule} from 'ngx-toastr';
import {DialogboxComponent} from './host/dialogbox/dialogbox.component';
import {AddplanComponent} from './host/addplan/addplan.component';
import {AddestimateComponent} from './host/addestimate/addestimate.component';
import {AddreadyComponent} from './host/addready/addready.component';
import {FinalresultComponent} from './host/finalresult/finalresult.component';
import {GameplayComponent} from './host/gameplay/gameplay.component';
import {MatTableModule} from '@angular/material/table';
import {RoundresultComponent} from './host/roundresult/roundresult.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { EstimateComponent } from './gameplay/estimate/estimate.component';
import {HeaderComponent} from './gameplay/common/header/header.component';
import { PlanningComponent } from './gameplay/planning/planning.component';
import { ResultroundComponent } from './gameplay/resultround/resultround.component';
import { PlaygameComponent } from './gameplay/playgame/playgame.component';
import { GoodroundComponent } from './gameplay/goodround/goodround.component';
import { MainComponent } from './gameplay/main/main.component';
import { ReadyaddComponent } from './gameplay/readyadd/readyadd.component';
import { GameresultComponent } from './gameplay/gameresult/gameresult.component';
import { WaitingComponent } from './gameplay/waiting/waiting.component';
import { GamenotfoundComponent } from './gameplay/gamenotfound/gamenotfound.component';
 import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { UnacceptableComponent } from './gameplay/unacceptable/unacceptable.component';



@NgModule({
    imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        SharedModule,
        AppRoutingModule,
        MatProgressSpinnerModule,
        FlexLayoutModule,
        MatCheckboxModule,
        ToastrModule.forRoot(),
        MatTableModule,
        DragDropModule,
        MatAutocompleteModule,
        MatSlideToggleModule
    ],
  declarations: [AppComponent,
    HeaderComponent,
    HomeComponent, SearchgameComponent, PlayerdashboardComponent,
    GamedashboardComponent, AddplayerComponent, SignupComponent, LoginComponent,
    UpdateprofileComponent, LoginhelpComponent, HomescreenComponent, DashboardComponent,
    ResetpasswordComponent, MessageComponent, GamesettingsComponent, WaitingplayersComponent,
    UpdatepasswordComponent, DialogboxComponent, AddplanComponent, AddestimateComponent,
    AddreadyComponent, FinalresultComponent, GameplayComponent, RoundresultComponent,
    EstimateComponent, PlanningComponent, ResultroundComponent, PlaygameComponent, GoodroundComponent, MainComponent, ReadyaddComponent, GameresultComponent, WaitingComponent, GamenotfoundComponent, UnacceptableComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CatchErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})

export class AppModule {
}
