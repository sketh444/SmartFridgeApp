import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFoodToFridgePage } from './add-food-to-fridge';

@NgModule({
  declarations: [
    AddFoodToFridgePage,
  ],
  imports: [
    IonicPageModule.forChild(AddFoodToFridgePage),
  ],
})
export class AddFoodToFridgePageModule {}
