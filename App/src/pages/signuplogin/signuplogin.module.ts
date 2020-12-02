import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignUpLogInPage } from './signuplogin';

@NgModule({
  declarations: [
    SignUpLogInPage,
  ],
  imports: [
    IonicPageModule.forChild(SignUpLogInPage),
  ],
})

export class SignuploginPageModule {}
