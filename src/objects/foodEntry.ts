import { Food } from "./food";
import { Emotion } from "./emotion";

export interface FoodEntry {
    food: Food;
    time: string;
    initialEmotion: string;
    finalEmotion: string;
    initialEmotionValue: string;
    finalEmotionValue: string;
 }