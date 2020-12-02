import { HttpClient} from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { foodNutritionData } from '../../data/foodNutritionData';
import { FoodEntry } from '../../objects/foodEntry';
import { Emotion } from '../../objects/emotion';

/*
  Generated class for the EmotionNutrientRestServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EmotionNutrientRestServiceProvider {

  happyFoodIDs: any=["19905", "12155", "20137", "9037", "11090", "9040", "11477", "1256", "15077", "15127", "11233", "9050", "9302", "12061", "42240"];
sadFoodIDs: any=["19905", "12155", "20137", "9037", "11090", "9040", "11477", "1256", "15077", "15127", "11233", "9050", "9302", "12061", "42240"];
  stressedFoodIDs: any=["11457", "11233", "12085", "1123", "9200", "9050", "9302", "42240", "5018", "13020", "15167" , "12085", "11212"];
  distressedFoodIDs: any=["11457", "11233", "12085", "1123", "9200", "9050", "9302", "42240", "5018", "13020", "15167" , "12085", "11212"];
  scaredFoodIDs: any=["11457", "11233", "12085", "1123", "9200", "9050", "9302", "42240", "5018", "13020", "15167" , "12085", "11212"];
  boredFoodIDs: any=["1116", "9040", "20036", "11507", "11080", "15077", "15127", "20137", "11457", "11233", "9004", "1123" ];
  angryFoodIDs: any=["9316", "12220", "12155","12695","12037", "15077", "15127", "19905", "12061", "5314", "16090", "11212", "11124"];
  disgustedFoodIDs: any=["9316", "12220", "12155","12695","12037", "15077", "15127", "19905", "12061", "5314", "16090", "11212", "11124"];

  lessHappyFoodIDs: any=["9209","14130","18248","14179","14625","19088","1077","36014","21464","19047","7057","7961","16123","10862",
"42236","19068","19069","19070","19142"];
  moreSadFoodIDs: any=["9209","14130","18248","14179","14625","19088","1077","36014","21464","19047","7057","7961","16123","10862",
  "42236","19068","19069","19070","19142"];
  moreStressedFoodIDs: any=["8510", "8546","19438", "19896", "19905", "19910", "19913", "19914","19917","19919","19921","19922","19923","28312","28313","42173",
  "100173","7005","7014","14179","14201","14202","14210","14552","21464","36014","7057","14174","21151","14021","18090","18095","18151","18248",
"11135","11994","19003","27043","9400","42236"];
  moreDistressedFoodIDs: any=["8510", "8546","19438", "19896", "19905", "19910", "19913", "19914","19917","19919","19921","19922","19923","28312","28313","42173",
  "100173","7005","7014","14179","14201","14202","14210","14552","21464","36014","7057","14174","21151","14021","18090","18095","18151","18248",
"11135","11994","19003","27043","9400","42236"];
  moreScaredFoodIDs: any=["8510", "8546","19438", "19896", "19905", "19910", "19913", "19914","19917","19919","19921","19922","19923","28312","28313","42173",
  "100173","7005","7014","14179","14201","14202","14210","14552","21464","36014","7057","14174","21151","14021","18090","18095","18151","18248",
"11135","11994","19003","27043","9400","42236"];
  moreBoredFoodIDs: any=["21090","36014","19068","19069","19070","19142","19151","19152","21224","28312","42283","18258","9070","20120",
  "22247","42236","18155","27035","43506","43541","1077","42140"];
  moreAngryFoodIDs: any=["11529","11209","36014","21090","18090","18096","18155","18015","4610","21224","18248",
  "21464","25001","25026","25064","28303","19068","19069","19070","19142","19151","19293","42236","10862","42140"];
  moreDisgustedFoodIDs: any=["11529","11209","36014","21090","18090","18096","18155","18015","4610","21224","18248",
  "21464","25001","25026","25064","28303","19068","19069","19070","19142","19151","19293","42236","10862","42140"];

  baseUrl:string = "http://localhost:5000/";
  username: string="";
  uid: string="";
  fridge: any=[];
  emotionFoods: any=[];
  requestOptions: any;

  constructor(public http: HttpClient, public angularFireAuth: AngularFireAuth, public angularFireStore: AngularFirestore) {
    console.log('Hello EmotionNutrientRestServiceProvider Provider');
    this.angularFireAuth.authState.subscribe(res => {
      if (res && res.uid) {
         this.username=res.uid; 
         this.uid=res.uid;
      }
    });
  }

  initUser(){
    if(this.username!==""){
      var headers = new Headers();
      headers.append('Access-Control-Allow-Origin' , '*');
      headers.append('Access-Control-Allow-Methods', 'GET');
      headers.append('Content-Type', 'application/json' );
      this.requestOptions = new RequestOptions({ headers: headers });
      return this.http.get(this.baseUrl + 'init_user/'+this.username, this.requestOptions);  
    }
  }

  predictEmotionForSpecificFood(food){
    if(this.username!=="" && this.uid!==""){
                var fridgeFoodData = foodNutritionData.foodData.filter(obj => {
                  return obj.Ingredient_Code === food.ingredientCode
                })[0];
                console.log("PREDICT EMOTION URL: "+this.baseUrl + 'predict_mood/'+this.username+"?protein="+fridgeFoodData["Protein"]+"&totalFat="+fridgeFoodData["Total Fat"]
                +"&carbohydrate="+fridgeFoodData["Carbohydrate"]+"&energy="+fridgeFoodData["Energy"]+"&alcohol="+fridgeFoodData["Alcohol"]
                +"&water="+fridgeFoodData["Water"]+"&caffeine="+fridgeFoodData["Caffeine"]+"&theobromine="+fridgeFoodData["Theobromine"]
                +"&sugars="+fridgeFoodData["Sugars"]+"&fiber="+fridgeFoodData["Fiber"]+"&calcium="+fridgeFoodData["Calcium"]+"&iron="+fridgeFoodData["Iron"]
                +"&magnesium="+fridgeFoodData["Magnesium"]+"&phosphorus="+fridgeFoodData["Phosphorus"]+"&potassium="+fridgeFoodData["Potassium"]
                +"&sodium="+fridgeFoodData["Sodium"]+"&zinc="+fridgeFoodData["Zinc"]+"&copper="+fridgeFoodData["Copper"]
                +"&selenium="+fridgeFoodData["Selenium"]+"&retinol="+fridgeFoodData["Retinol"]+"&vitA="+fridgeFoodData["Vitamin A"]
                +"&betaCarotene="+fridgeFoodData["Beta Carotene"]+"&alphaCarotene="+fridgeFoodData["Alpha Carotene"]+"&vitE="+fridgeFoodData["Vitamin E"]
                +"&vitD="+fridgeFoodData["Vitamin D"]+"&cryptoxanthin="+fridgeFoodData["Cryptoxanthin"]+"&Lycopene="+fridgeFoodData["Lycopene"]
                +"&Lutein="+fridgeFoodData["Lutein"]+"&vitC="+fridgeFoodData["Vitamin C"]+"&thiamin="+fridgeFoodData["Thiamin"]
                +"&riboflavin="+fridgeFoodData["Riboflavin"]+"&niacin="+fridgeFoodData["Niacin"]+"&vitB6="+fridgeFoodData["Vitamin B-6"]
                +"&folate="+fridgeFoodData["Folate"]+"&vitB12="+fridgeFoodData["Vitamin B-12"]+"&choline="+fridgeFoodData["Choline"]
                +"&vitK="+fridgeFoodData["Vitamin K"]+"&folicAcid="+fridgeFoodData["Folic acid"]
                +"&cholesterol="+fridgeFoodData["Cholesterol"]+"&fattyAcids="+fridgeFoodData["Fatty acids"])

                return this.http.get(this.baseUrl + 'predict_mood/'+this.username+"?protein="+fridgeFoodData["Protein"]+"&totalFat="+fridgeFoodData["Total Fat"]
                +"&carbohydrate="+fridgeFoodData["Carbohydrate"]+"&energy="+fridgeFoodData["Energy"]+"&alcohol="+fridgeFoodData["Alcohol"]
                +"&water="+fridgeFoodData["Water"]+"&caffeine="+fridgeFoodData["Caffeine"]+"&theobromine="+fridgeFoodData["Theobromine"]
                +"&sugars="+fridgeFoodData["Sugars"]+"&fiber="+fridgeFoodData["Fiber"]+"&calcium="+fridgeFoodData["Calcium"]+"&iron="+fridgeFoodData["Iron"]
                +"&magnesium="+fridgeFoodData["Magnesium"]+"&phosphorus="+fridgeFoodData["Phosphorus"]+"&potassium="+fridgeFoodData["Potassium"]
                +"&sodium="+fridgeFoodData["Sodium"]+"&zinc="+fridgeFoodData["Zinc"]+"&copper="+fridgeFoodData["Copper"]
                +"&selenium="+fridgeFoodData["Selenium"]+"&retinol="+fridgeFoodData["Retinol"]+"&vitA="+fridgeFoodData["Vitamin A"]
                +"&betaCarotene="+fridgeFoodData["Beta Carotene"]+"&alphaCarotene="+fridgeFoodData["Alpha Carotene"]+"&vitE="+fridgeFoodData["Vitamin E"]
                +"&vitD="+fridgeFoodData["Vitamin D"]+"&cryptoxanthin="+fridgeFoodData["Cryptoxanthin"]+"&Lycopene="+fridgeFoodData["Lycopene"]
                +"&Lutein="+fridgeFoodData["Lutein"]+"&vitC="+fridgeFoodData["Vitamin C"]+"&thiamin="+fridgeFoodData["Thiamin"]
                +"&riboflavin="+fridgeFoodData["Riboflavin"]+"&niacin="+fridgeFoodData["Niacin"]+"&vitB6="+fridgeFoodData["Vitamin B-6"]
                +"&folate="+fridgeFoodData["Folate"]+"&vitB12="+fridgeFoodData["Vitamin B-12"]+"&choline="+fridgeFoodData["Choline"]
                +"&vitK="+fridgeFoodData["Vitamin K"]+"&folicAcid="+fridgeFoodData["Folic acid"]
                +"&cholesterol="+fridgeFoodData["Cholesterol"]+"&fattyAcids="+fridgeFoodData["Fatty acids"]);
              }
  }

  predictEmotions(): any{
    if(this.username!=="" && this.uid!==""){
          this.angularFireStore.firestore.doc('/users/'+this.uid).collection('fridge').get().then(docSnapshot => {
            if(docSnapshot){
              var res=docSnapshot.docs.map(doc => doc.data());
              for (let fridgeItem of res){
                var fridgeFoodData = foodNutritionData.foodData.filter(obj => {
                  return obj.Ingredient_Code === fridgeItem["ingredientCode"]
                })[0];
                this.http.get(this.baseUrl + 'predict_mood/'+this.username+"?protein="+fridgeFoodData["Protein"]+"&totalFat="+fridgeFoodData["Total Fat"]
                +"&carbohydrate="+fridgeFoodData["Carbohydrate"]+"&energy="+fridgeFoodData["Energy"]+"&alcohol="+fridgeFoodData["Alcohol"]
                +"&water="+fridgeFoodData["Water"]+"&caffeine="+fridgeFoodData["Caffeine"]+"&theobromine="+fridgeFoodData["Theobromine"]
                +"&sugars="+fridgeFoodData["Sugars"]+"&fiber="+fridgeFoodData["Fiber"]+"&calcium="+fridgeFoodData["Calcium"]+"&iron="+fridgeFoodData["Iron"]
                +"&magnesium="+fridgeFoodData["Magnesium"]+"&phosphorus="+fridgeFoodData["Phosphorus"]+"&potassium="+fridgeFoodData["Potassium"]
                +"&sodium="+fridgeFoodData["Sodium"]+"&zinc="+fridgeFoodData["Zinc"]+"&copper="+fridgeFoodData["Copper"]
                +"&selenium="+fridgeFoodData["Selenium"]+"&retinol="+fridgeFoodData["Retinol"]+"&vitA="+fridgeFoodData["Vitamin A"]
                +"&betaCarotene="+fridgeFoodData["Beta Carotene"]+"&alphaCarotene="+fridgeFoodData["Alpha Carotene"]+"&vitE="+fridgeFoodData["Vitamin E"]
                +"&vitD="+fridgeFoodData["Vitamin D"]+"&cryptoxanthin="+fridgeFoodData["Cryptoxanthin"]+"&Lycopene="+fridgeFoodData["Lycopene"]
                +"&Lutein="+fridgeFoodData["Lutein"]+"&vitC="+fridgeFoodData["Vitamin C"]+"&thiamin="+fridgeFoodData["Thiamin"]
                +"&riboflavin="+fridgeFoodData["Riboflavin"]+"&niacin="+fridgeFoodData["Niacin"]+"&vitB6="+fridgeFoodData["Vitamin B-6"]
                +"&folate="+fridgeFoodData["Folate"]+"&vitB12="+fridgeFoodData["Vitamin B-12"]+"&choline="+fridgeFoodData["Choline"]
                +"&vitK="+fridgeFoodData["Vitamin K"]+"&folicAcid="+fridgeFoodData["Folic acid"]
                +"&cholesterol="+fridgeFoodData["Cholesterol"]+"&fattyAcids="+fridgeFoodData["Fatty acids"]).subscribe(
                  data => {
                    console.log("PREDICT DATA: " +fridgeItem["ingredientCode"]+" "+JSON.stringify(data));
                    this.emotionFoods.push(data["mood"]);
                  },
                  error=>{
                    console.log("PREDICT ERROR: " +JSON.stringify(error));
                  }
                );
                console.log("PREDICT EMOTION URL: "+this.baseUrl + 'predict_mood/'+this.username+"?protein="+fridgeFoodData["Protein"]+"&totalFat="+fridgeFoodData["Total Fat"]
                +"&carbohydrate="+fridgeFoodData["Carbohydrate"]+"&energy="+fridgeFoodData["Energy"]+"&alcohol="+fridgeFoodData["Alcohol"]
                +"&water="+fridgeFoodData["Water"]+"&caffeine="+fridgeFoodData["Caffeine"]+"&theobromine="+fridgeFoodData["Theobromine"]
                +"&sugars="+fridgeFoodData["Sugars"]+"&fiber="+fridgeFoodData["Fiber"]+"&calcium="+fridgeFoodData["Calcium"]+"&iron="+fridgeFoodData["Iron"]
                +"&magnesium="+fridgeFoodData["Magnesium"]+"&phosphorus="+fridgeFoodData["Phosphorus"]+"&potassium="+fridgeFoodData["Potassium"]
                +"&sodium="+fridgeFoodData["Sodium"]+"&zinc="+fridgeFoodData["Zinc"]+"&copper="+fridgeFoodData["Copper"]
                +"&selenium="+fridgeFoodData["Selenium"]+"&retinol="+fridgeFoodData["Retinol"]+"&vitA="+fridgeFoodData["Vitamin A"]
                +"&betaCarotene="+fridgeFoodData["Beta Carotene"]+"&alphaCarotene="+fridgeFoodData["Alpha Carotene"]+"&vitE="+fridgeFoodData["Vitamin E"]
                +"&vitD="+fridgeFoodData["Vitamin D"]+"&cryptoxanthin="+fridgeFoodData["Cryptoxanthin"]+"&Lycopene="+fridgeFoodData["Lycopene"]
                +"&Lutein="+fridgeFoodData["Lutein"]+"&vitC="+fridgeFoodData["Vitamin C"]+"&thiamin="+fridgeFoodData["Thiamin"]
                +"&riboflavin="+fridgeFoodData["Riboflavin"]+"&niacin="+fridgeFoodData["Niacin"]+"&vitB6="+fridgeFoodData["Vitamin B-6"]
                +"&folate="+fridgeFoodData["Folate"]+"&vitB12="+fridgeFoodData["Vitamin B-12"]+"&choline="+fridgeFoodData["Choline"]
                +"&vitK="+fridgeFoodData["Vitamin K"]+"&folicAcid="+fridgeFoodData["Folic acid"]
                +"&cholesterol="+fridgeFoodData["Cholesterol"]+"&fattyAcids="+fridgeFoodData["Fatty acids"])
              }
              console.log("ALL PREDICTED EMOTIONS: "+JSON.stringify(this.emotionFoods));
              return this.emotionFoods;
            }
          });
    }
  }

  learn(ingredientCode: string, emotionId: string){
    //when the user is setting up their account, train this model on the food proven to help with different emotions AND on the foods which the user enters
    if(this.username!==""){
      var fridgeFoodData = foodNutritionData.foodData.filter(obj => {
        return obj.Ingredient_Code === ingredientCode
      })[0];
        return this.http.get(this.baseUrl + 'learn_behavior/'+this.username+"?protein="+fridgeFoodData["Protein"]+"&totalFat="+fridgeFoodData["Total Fat"]
        +"&carbohydrate="+fridgeFoodData["Carbohydrate"]+"&energy="+fridgeFoodData["Energy"]+"&alcohol="+fridgeFoodData["Alcohol"]
        +"&water="+fridgeFoodData["Water"]+"&caffeine="+fridgeFoodData["Caffeine"]+"&theobromine="+fridgeFoodData["Theobromine"]
        +"&sugars="+fridgeFoodData["Sugars"]+"&fiber="+fridgeFoodData["Fiber"]+"&calcium="+fridgeFoodData["Calcium"]+"&iron="+fridgeFoodData["Iron"]
        +"&magnesium="+fridgeFoodData["Magnesium"]+"&phosphorus="+fridgeFoodData["Phosphorus"]+"&potassium="+fridgeFoodData["Potassium"]
        +"&sodium="+fridgeFoodData["Sodium"]+"&zinc="+fridgeFoodData["Zinc"]+"&copper="+fridgeFoodData["Copper"]
        +"&selenium="+fridgeFoodData["Selenium"]+"&retinol="+fridgeFoodData["Retinol"]+"&vitA="+fridgeFoodData["Vitamin A"]
        +"&betaCarotene="+fridgeFoodData["Beta Carotene"]+"&alphaCarotene="+fridgeFoodData["Alpha Carotene"]+"&vitE="+fridgeFoodData["Vitamin E"]
        +"&vitD="+fridgeFoodData["Vitamin D"]+"&cryptoxanthin="+fridgeFoodData["Cryptoxanthin"]+"&Lycopene="+fridgeFoodData["Lycopene"]
        +"&Lutein="+fridgeFoodData["Lutein"]+"&vitC="+fridgeFoodData["Vitamin C"]+"&thiamin="+fridgeFoodData["Thiamin"]
        +"&riboflavin="+fridgeFoodData["Riboflavin"]+"&niacin="+fridgeFoodData["Niacin"]+"&vitB6="+fridgeFoodData["Vitamin B-6"]
        +"&folate="+fridgeFoodData["Folate"]+"&vitB12="+fridgeFoodData["Vitamin B-12"]+"&choline="+fridgeFoodData["Choline"]
        +"&vitK="+fridgeFoodData["Vitamin K"]+"&folicAcid="+fridgeFoodData["Folic acid"]
        +"&cholesterol="+fridgeFoodData["Cholesterol"]+"&fattyAcids="+fridgeFoodData["Fatty acids"]
        +"&mood="+emotionId);
    }
  }


  trainModelWhenOnboarding(user){
    console.log("train model when onboarding");
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
    for(let happyFood of user.happyFoods){
      console.log("INGREDIENT CODE: "+happyFood.ingredientCode);
      this.learn(happyFood.ingredientCode, "0").subscribe(
        data => {
          console.log("HAPPY FOOD TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("HAPPY FOOD TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let happyFood of this.happyFoodIDs){
      this.learn(happyFood, "0").subscribe(
        data => {
          console.log("HAPPY FOOD IDS TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("HAPPY FOOD IDS TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let sadFood of user.sadFoods){
      this.learn(sadFood.ingredientCode, "1").subscribe(
        data => {
          console.log("SAD FOOD TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("SAD FOOD TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let sadFood of this.sadFoodIDs){
      this.learn(sadFood, "1").subscribe(
        data => {
          console.log("SAD FOOD IDS TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("SAD FOOD IDS TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let angryFood of user.angryFoods){
      this.learn(angryFood.ingredientCode, "2").subscribe(
        data => {
          console.log("ANGRY FOOD TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("ANGRY FOOD TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let angryFood of this.angryFoodIDs){
      this.learn(angryFood, "2").subscribe(
        data => {
          console.log("ANGRY FOOD IDS TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("ANGRY FOOD IDS TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let disgustedFood of user.disgustedFoods){
      this.learn(disgustedFood.ingredientCode, "3").subscribe(
        data => {
          console.log("DISGUSTED FOOD TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("DISGUSTED FOOD TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let disgustedFood of this.disgustedFoodIDs){
      this.learn(disgustedFood, "3").subscribe(
        data => {
          console.log("DISGUSTED FOOD IDS TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("DISGUSTED FOOD IDS TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let scaredFood of user.scaredFoods){
      this.learn(scaredFood.ingredientCode, "4").subscribe(
        data => {
          console.log("SCARED FOOD TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("SCARED FOOD TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let scaredFood of this.scaredFoodIDs){
      this.learn(scaredFood, "4").subscribe(
        data => {
          console.log("SCARED FOOD IDS TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("SCARED FOOD IDS TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let stressedFood of user.stressedFoods){
      this.learn(stressedFood.ingredientCode, "5").subscribe(
        data => {
          console.log("STRESSED FOOD TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("STRESSED FOOD TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let stressedFood of this.stressedFoodIDs){
      this.learn(stressedFood, "5").subscribe(
        data => {
          console.log("STRESSED FOOD IDS TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("STRESSED FOOD IDS TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let boredFood of user.boredFoods){
      this.learn(boredFood.ingredientCode, "6").subscribe(
        data => {
          console.log("BORED FOOD TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("BORED FOOD TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let boredFood of this.boredFoodIDs){
      this.learn(boredFood, "6").subscribe(
        data => {
          console.log("BORED FOOD IDS TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("BORED FOOD IDS TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let distressedFood of user.distressedFoods){
      this.learn(distressedFood.ingredientCode, "7").subscribe(
        data => {
          console.log("DISTRESSED FOOD TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("DISTRESSED FOOD TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let distressedFood of this.distressedFoodIDs){
      this.learn(distressedFood, "7").subscribe(
        data => {
          console.log("DISTRESSED FOOD IDS TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("DISTRESSED FOOD IDS TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }

    for(let lessHappyFood of this.lessHappyFoodIDs){
      this.learn(lessHappyFood, "8").subscribe(
        data => {
          console.log("LESS HAPPY FOOD IDS TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("LESS HAPPY FOOD IDS TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let moreSadFood of this.moreSadFoodIDs){
      this.learn(moreSadFood, "9").subscribe(
        data => {
          console.log("MORE SAD FOOD IDS TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("MORE SAD FOOD IDS TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let moreAngryFood of this.moreAngryFoodIDs){
      this.learn(moreAngryFood, "10").subscribe(
        data => {
          console.log("MORE ANGRY FOOD IDS TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("MORE ANGRY FOOD IDS TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let moreDisgustedFood of this.moreDisgustedFoodIDs){
      this.learn(moreDisgustedFood, "11").subscribe(
        data => {
          console.log("MORE DISGUSTED FOOD IDS TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("MORE DISGUSTED FOOD IDS TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let moreScaredFood of this.moreScaredFoodIDs){
      this.learn(moreScaredFood, "12").subscribe(
        data => {
          console.log("MORE SCARED FOOD IDS TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("MORE SCARED FOOD IDS TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let moreStressedFood of this.moreStressedFoodIDs){
      this.learn(moreStressedFood, "13").subscribe(
        data => {
          console.log("MORE STRESSED FOOD IDS TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("MORE STRESSED FOOD IDS TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let moreBoredFood of this.moreBoredFoodIDs){
      this.learn(moreBoredFood, "14").subscribe(
        data => {
          console.log("MORE BORED FOOD IDS TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("MORE BORED FOOD IDS TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    for(let moreDistressedFood of this.moreDistressedFoodIDs){
      this.learn(moreDistressedFood, "15").subscribe(
        data => {
          console.log("MORE DISTRESSED FOOD IDS TRAINED: " +JSON.stringify(data));
        },
        error=>{
          console.log("MORE DISTRESSED FOOD IDS TRAINED ERROR: " +JSON.stringify(error));
        }
      );
    }
    console.log("done");
    return user;
  }

}
