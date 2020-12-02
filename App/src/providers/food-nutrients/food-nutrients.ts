import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { foodNutritionData } from '../../data/foodNutritionData';

/*
  Generated class for the FoodNutrientsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FoodNutrientsProvider {
  
  foodNames: any=[];

  constructor() {
    console.log('Hello FoodNutrientsProvider Provider');
  }

  public parseFoodNutritionData(): [string]{
    for (let foodNutrition of foodNutritionData.foodData){
        this.foodNames.push(foodNutrition.Ingredient_Name);
    }
    return this.foodNames;
  }

}
