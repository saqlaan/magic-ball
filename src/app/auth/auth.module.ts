import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';

import { SignupComponent } from './signup/signup.component';


@NgModule({
  imports: [SharedModule, AuthRoutingModule],
  declarations: [SignupComponent],
})
export class AuthModule {}
