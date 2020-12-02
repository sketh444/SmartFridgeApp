import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFridgeItemPage } from './add-fridge-item';

@NgModule({
  declarations: [
    AddFridgeItemPage,
  ],
  imports: [
    IonicPageModule.forChild(AddFridgeItemPage),
  ],
})
export class AddFridgeItemPageModule {}
