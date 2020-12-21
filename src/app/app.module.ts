import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {SharedModule} from './shared/shared.module';

import {AppComponent} from './app.component';
import {AuthHeaderInterceptor} from './interceptors/header.interceptor';
import {CatchErrorInterceptor} from './interceptors/http-error.interceptor';

import {AppRoutingModule} from './app-routing.module';
import {HeaderComponent} from './header/header.component';
import {HomeComponent} from './home/home.component';
import {SearchgameComponent} from './player/searchgame/searchgame.component';
import {PlayerdashboardComponent} from './player/playerdashboard/playerdashboard.component';
import {GamedashboardComponent} from './host/gamedashboard/gamedashboard.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {AddplayerComponent} from './player/addplayer/addplayer.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { SignupComponent } from './host/signup/signup.component';
import { LoginComponent } from './host/login/login.component';
import { UpdateprofileComponent } from './host/updateprofile/updateprofile.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    FlexLayoutModule
  ],
  declarations: [AppComponent,
    HeaderComponent,
    HomeComponent, SearchgameComponent, PlayerdashboardComponent,
    GamedashboardComponent, AddplayerComponent, SignupComponent, LoginComponent, UpdateprofileComponent],
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
