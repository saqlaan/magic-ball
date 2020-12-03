import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';

import { SignupComponent } from './signup/signup.component';
import { GameComponent } from './game/game.component';
import { SearchgameComponent } from './searchgame/searchgame.component';

@NgModule({
  imports: [SharedModule, AuthRoutingModule],
  declarations: [SignupComponent, GameComponent, SearchgameComponent],
})
export class AuthModule {}
