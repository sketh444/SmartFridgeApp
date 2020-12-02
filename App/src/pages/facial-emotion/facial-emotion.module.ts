import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FacialEmotionPage } from './facial-emotion';

@NgModule({
  declarations: [
    FacialEmotionPage,
  ],
  imports: [
    IonicPageModule.forChild(FacialEmotionPage),
  ],
})
export class FacialEmotionPageModule {}
