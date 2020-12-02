import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FridgePage } from './fridge';

@NgModule({
  declarations: [
    FridgePage,
  ],
  imports: [
    IonicPageModule.forChild(FridgePage),
  ],
})
export class FridgePageModule {}
