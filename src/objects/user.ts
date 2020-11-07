import { Food } from "./food";
import { FoodEntry } from "./foodEntry";
import { Allergy } from "./allergy";
import { FoodObject } from "./foodObject";

export interface User {
   uid: string;
   name: string;
   foodEntries: Map<string, FoodEntry>;
   fridge: [Food];
   groceryList: [Food];
   allergies: [Allergy];
   typeOfDiet: number;
   goal: number;
   height: number;
   weight: number;
   age: number;
   gender: number;
   happyFoods: [FoodObject];
   sadFoods: [FoodObject];
   angryFoods: [FoodObject];
   disgustedFoods: [FoodObject];
   scaredFoods: [FoodObject];
   stressedFoods: [FoodObject];
   boredFoods: [FoodObject];
   distressedFoods: [FoodObject];
   logMealApiKey: string;
   logMealId: string;
}