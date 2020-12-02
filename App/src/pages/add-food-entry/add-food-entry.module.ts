import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFoodEntryPage } from './add-food-entry';

@NgModule({
  declarations: [
    AddFoodEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(AddFoodEntryPage),
  ],
})
export class AddFoodEntryPageModule {}
