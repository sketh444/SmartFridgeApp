import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { foodNutritionData } from '../../data/foodNutritionData';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { EmotionNutrientRestServiceProvider } from '../../providers/emotion-nutrient-rest-service/emotion-nutrient-rest-service';

/**
 * Generated class for the EmotionRecommendationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-emotion-recommendation',
  templateUrl: 'emotion-recommendation.html',
})
export class EmotionRecommendationPage {

  emotion: any;
  emotionId: string="-1";

  emotionSpecificFoods: any=[];
  foodEntriesList: any=[];
  foodList: any=[];
        /*
Happy: 0
Sad: 1
Angry: 2
Disgusted: 3
Scared: 4
Stressed: 5
Bored: 6
Distressed: 7
Less Happy: 8
More Sad: 9
More Angry: 10
More Disgusted: 11
More Scared: 12
More Stressed: 13
More Bored: 14
More Distressed: 15*/

  happyFoodIDs: any=["19905", "12155", "20137", "9037", "11090", "9040", "11477", "1256", "15077", "15127", "11233", "9050", "9302", "12061", "42240"];
sadFoodIDs: any=["19905", "12155", "20137", "9037", "11090", "9040", "11477", "1256", "15077", "15127", "11233", "9050", "9302", "12061", "42240"];
  stressedFoodIDs: any=["11457", "11233", "12085", "1123", "9200", "9050", "9302", "42240", "5018", "13020", "15167" , "12085", "11212"];
  distressedFoodIDs: any=["11457", "11233", "12085", "1123", "9200", "9050", "9302", "42240", "5018", "13020", "15167" , "12085", "11212"];
  scaredFoodIDs: any=["11457", "11233", "12085", "1123", "9200", "9050", "9302", "42240", "5018", "13020", "15167" , "12085", "11212"];
  boredFoodIDs: any=["1116", "9040", "20036", "11507", "11080", "15077", "15127", "20137", "11457", "11233", "9004", "1123" ];
  angryFoodIDs: any=["9316", "12220", "12155","12695","12037", "15077", "15127", "19905", "12061", "5314", "16090", "11212", "11124"];
  disgustedFoodIDs: any=["9316", "12220", "12155","12695","12037", "15077", "15127", "19905", "12061", "5314", "16090", "11212", "11124"];

  constructor(public navCtrl: NavController, public navParams: NavParams, public angularFireAuth: AngularFireAuth, public angularFireStore: AngularFirestore,
    public emotionNutrientRestService: EmotionNutrientRestServiceProvider) {
    this.emotion=navParams.get('emotion')
  }

  ionViewDidLoad() {
          /*
Happy: 0
Sad: 1
Angry: 2
Disgusted: 3
Scared: 4
Stressed: 5
Bored: 6
Distressed: 7
Less Happy: 8
More Sad: 9
More Angry: 10
More Disgusted: 11
More Scared: 12
More Stressed: 13
More Bored: 14
More Distressed: 15*/
    console.log('ionViewDidLoad EmotionRecommendationPage');
    if(this.emotion=="Happy"){
      this.emotionId="0";
      for(let happyFoodID of this.happyFoodIDs){
        var result = foodNutritionData.foodData.filter(obj => {
          return obj.Ingredient_Code === happyFoodID
        })[0];
       
        this.emotionSpecificFoods.push(result);
      }
    } else if(this.emotion=="Sad"){
      this.emotionId="1";
      for(let sadFoodID of this.sadFoodIDs){
        var result = foodNutritionData.foodData.filter(obj => {
          return obj.Ingredient_Code === sadFoodID
        })[0];
        this.emotionSpecificFoods.push(result);
      }
    } else if(this.emotion=="Angry"){
      this.emotionId="2";
      for(let happyFoodID of this.angryFoodIDs){
        var result = foodNutritionData.foodData.filter(obj => {
          return obj.Ingredient_Code === happyFoodID
        })[0];
        this.emotionSpecificFoods.push(result);
      }
    } else if(this.emotion=="Disgusted"){
      this.emotionId="3";
      for(let happyFoodID of this.disgustedFoodIDs){
        var result = foodNutritionData.foodData.filter(obj => {
          return obj.Ingredient_Code === happyFoodID
        })[0];
        this.emotionSpecificFoods.push(result);
      }
    } else if(this.emotion=="Scared"){
      this.emotionId="4";
      for(let happyFoodID of this.scaredFoodIDs){
        var result = foodNutritionData.foodData.filter(obj => {
          return obj.Ingredient_Code === happyFoodID
        })[0];
        this.emotionSpecificFoods.push(result);
      }
    } else if(this.emotion=="Stressed"){
      this.emotionId="5";
      for(let happyFoodID of this.stressedFoodIDs){
        var result = foodNutritionData.foodData.filter(obj => {
          return obj.Ingredient_Code === happyFoodID
        })[0];
        this.emotionSpecificFoods.push(result);
      }
    } else if(this.emotion=="Bored"){
      this.emotionId="6";
      for(let happyFoodID of this.boredFoodIDs){
        var result = foodNutritionData.foodData.filter(obj => {
          return obj.Ingredient_Code === happyFoodID
        })[0];
        this.emotionSpecificFoods.push(result);
      }
    } else if(this.emotion=="Distressed"){
      this.emotionId="7";
      for(let happyFoodID of this.distressedFoodIDs){
        var result = foodNutritionData.foodData.filter(obj => {
          return obj.Ingredient_Code === happyFoodID
        })[0];
        this.emotionSpecificFoods.push(result);
      }
    }

    this.angularFireAuth.authState.subscribe(res => {
      if (res && res.uid) {
        console.log('/users/'+res.uid)
        this.angularFireStore.firestore.doc('/users/'+res.uid).collection('foodEntries').get().then(docSnapshot => {
          if (docSnapshot) {
            let foodEntries=docSnapshot.docs.map(doc => doc.data());
            console.log(JSON.stringify(foodEntries));
            let emotionFoodEntries = foodEntries.filter(obj => {
              return obj.initialEmotion === this.emotionId
            });
            console.log(JSON.stringify(emotionFoodEntries));
            this.emotionNutrientRestService.initUser().subscribe(
              res => {
              for(let foodEntry of emotionFoodEntries){
                  this.emotionNutrientRestService.predictEmotionForSpecificFood(foodEntry.food).subscribe(
                    result => {
                      console.log("PREDICT DATA: " +foodEntry.food.ingredientCode+" "+JSON.stringify(result));
                      let data=result["mood"];
                      console.log("FOOD ENTRY FOOD NAME: "+JSON.stringify(foodEntry.food.foodName));
                      if(data=="0"){
                        this.foodEntriesList.push(foodEntry.food.foodName+": This food is good for you, it causes happiness.");
                      } else if (data=="1"){
                        this.foodEntriesList.push(foodEntry["food"].foodName+": This food is good for you, it helps with sadness");
                      } else if (data=="2"){
                        this.foodEntriesList.push(foodEntry["food"].foodName+": This food is good for you, it helps with anger");
                      } else if (data=="3"){
                        this.foodEntriesList.push(foodEntry["food"].foodName+": This food is good for you, it helps with disgust");
                      } else if (data=="4"){
                        this.foodEntriesList.push(foodEntry["food"].foodName+": This food is good for you, it helps with fear");
                      } else if (data=="5"){
                        this.foodEntriesList.push(foodEntry["food"].foodName+": This food is good for you, it helps with stress");
                      } else if (data=="6"){
                        this.foodEntriesList.push(foodEntry["food"].foodName+": This food is good for you, it helps with boredom");
                      } else if (data=="7"){
                        this.foodEntriesList.push(foodEntry["food"].foodName+": This food is good for you, it helps with distress");
                      } else if (data=="8"){
                        this.foodEntriesList.push(foodEntry["food"].foodName+": This food is bad for you, it makes you less happy");
                      } else if (data=="9"){
                        this.foodEntriesList.push(foodEntry["food"].foodName+": This food is bad for you, it causes sadness");
                      } else if (data=="10"){
                        this.foodEntriesList.push(foodEntry["food"].foodName+": This food is bad for you, it causes anger");
                      } else if (data=="11"){
                        this.foodEntriesList.push(foodEntry["food"].foodName+": This food is bad for you, it causes disgust");
                      } else if (data=="12"){
                        this.foodEntriesList.push(foodEntry["food"].foodName+": This food is bad for you, it causes fear");
                      } else if (data=="13"){
                        this.foodEntriesList.push(foodEntry["food"].foodName+": This food is bad for you, it causes stress");
                      } else if (data=="14"){
                        this.foodEntriesList.push(foodEntry["food"].foodName+": This food is bad for you, it causes boredom");
                      } else if (data=="15"){
                        this.foodEntriesList.push(foodEntry["food"].foodName+": This food is bad for you, it causes distress");
                      }
                    },
                    error=>{
                      console.log("PREDICT ERROR: " +JSON.stringify(error));
                    }
                  );
                }
              },
            error=>{
              console.log("ERROR: " +JSON.stringify(error));
            });
          }
        });

        this.angularFireStore.firestore.doc('/users/'+res.uid).collection('fridge').get().then(docSnapshot => {
          if (docSnapshot) {
            let fridge=docSnapshot.docs.map(doc => doc.data());
            console.log(JSON.stringify(fridge));
            this.emotionNutrientRestService.initUser().subscribe(
              res => {
              for(let fridgeFood of fridge){
                if(fridgeFood.quantity>0){
                  this.emotionNutrientRestService.predictEmotionForSpecificFood(fridgeFood).subscribe(
                    result => {
                      console.log("PREDICT DATA: " +fridgeFood.ingredientCode+" "+JSON.stringify(result));
                      let data=result["mood"];
                      console.log("DATA FOOD: "+data);
                      /*
Happy: 0
Sad: 1
Angry: 2
Disgusted: 3
Scared: 4
Stressed: 5
Bored: 6
Distressed: 7
Less Happy: 8
More Sad: 9
More Angry: 10
More Disgusted: 11
More Scared: 12
More Stressed: 13
More Bored: 14
More Distressed: 15*/
                      if(data==this.emotionId){
                        this.foodList.push(fridgeFood.foodName);
                      } else if(data=="1" && this.emotionId=="0"){
                        this.foodList.push(fridgeFood.foodName);
                      } else if(data=="0" && this.emotionId=="1"){
                        this.foodList.push(fridgeFood.foodName);
                      } else if(data=="2" && this.emotionId=="3"){
                        this.foodList.push(fridgeFood.foodName);
                      } else if(data=="3" && this.emotionId=="2"){
                        this.foodList.push(fridgeFood.foodName);
                      } else if(data=="4" && (this.emotionId=="5" || this.emotionId=="7")){
                        this.foodList.push(fridgeFood.foodName);
                      } else if(data=="5" && (this.emotionId=="4" || this.emotionId=="7")){
                        this.foodList.push(fridgeFood.foodName);
                      } else if(data=="7" && (this.emotionId=="4" || this.emotionId=="5")){
                        this.foodList.push(fridgeFood.foodName);
                      }
                    },
                    error=>{
                      console.log("PREDICT ERROR: " +JSON.stringify(error));
                    }
                  );
                }
                }
              },
            error=>{
              console.log("ERROR: " +JSON.stringify(error));
            });
          }
        });
      }
    });

  }

}
