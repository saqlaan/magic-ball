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
import {GameComponent} from './game/game.component';
import { SearchgameComponent } from './searchgame/searchgame.component';
import { PlayerComponent } from './player/player.component';


// export function appInitializerFactory(authService: AuthService) {
//
// }

@NgModule({
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
  ],
  declarations: [AppComponent, HeaderComponent, HomeComponent, GameComponent, SearchgameComponent, PlayerComponent],
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
export class AppModule {}
