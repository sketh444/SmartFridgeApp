import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddToGroceryListPage } from './add-to-grocery-list';

@NgModule({
  declarations: [
    AddToGroceryListPage,
  ],
  imports: [
    IonicPageModule.forChild(AddToGroceryListPage),
  ],
})
export class AddToGroceryListPageModule {}
