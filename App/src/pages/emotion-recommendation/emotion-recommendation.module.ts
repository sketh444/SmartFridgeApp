import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmotionRecommendationPage } from './emotion-recommendation';

@NgModule({
  declarations: [
    EmotionRecommendationPage,
  ],
  imports: [
    IonicPageModule.forChild(EmotionRecommendationPage),
  ],
})
export class EmotionRecommendationPageModule {}
