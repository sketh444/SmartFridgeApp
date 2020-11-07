import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdvicePage } from './advice';

@NgModule({
  declarations: [
    AdvicePage,
  ],
  imports: [
    IonicPageModule.forChild(AdvicePage),
  ],
})
export class AdvicePageModule {}
