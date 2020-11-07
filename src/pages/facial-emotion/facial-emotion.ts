import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { EmotionNutrientRestServiceProvider } from '../../providers/emotion-nutrient-rest-service/emotion-nutrient-rest-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { SignUpLogInPage } from '../signuplogin/signuplogin';
import { FoodEntry } from '../../objects/foodEntry';
import { Food } from '../../objects/food';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { take } from 'rxjs/operators';
import { User } from '../../objects/user';
import { foodNutritionData } from '../../data/foodNutritionData';

/**
 * Generated class for the FacialEmotionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var affdex;

var JSSDK = JSSDK || {};
JSSDK.Assets = {
  "wasm": {
      "affdex-native-bindings.wasm": "https://download.affectiva.com/js/wasm/affdex-native-bindings.wasm",
      "affdex-native-bindings.js": "https://download.affectiva.com/js/wasm/affdex-native-bindings.js",
      "affdex-native-bindings.data": "https://download.affectiva.com/js/wasm/affdex-native-bindings.data",
      "affdex-worker.js": "https://download.affectiva.com/js/wasm/affdex-worker.js"
  }
};

@IonicPage()
@Component({
  selector: 'page-facial-emotion',
  templateUrl: 'facial-emotion.html',
})
export class FacialEmotionPage {

  happyFoodIDs: any=["19905", "12155", "20137", "9037", "11090", "9040", "11477", "1256", "15077", "15127", "11233", "9050", "9302", "12061", "42240"];
sadFoodIDs: any=["19905", "12155", "20137", "9037", "11090", "9040", "11477", "1256", "15077", "15127", "11233", "9050", "9302", "12061", "42240"];
  stressedFoodIDs: any=["11457", "11233", "12085", "1123", "9200", "9050", "9302", "42240", "5018", "13020", "15167" , "12085", "11212"];
  distressedFoodIDs: any=["11457", "11233", "12085", "1123", "9200", "9050", "9302", "42240", "5018", "13020", "15167" , "12085", "11212"];
  scaredFoodIDs: any=["11457", "11233", "12085", "1123", "9200", "9050", "9302", "42240", "5018", "13020", "15167" , "12085", "11212"];
  boredFoodIDs: any=["1116", "9040", "20036", "11507", "11080", "15077", "15127", "20137", "11457", "11233", "9004", "1123" ];
  angryFoodIDs: any=["9316", "12220", "12155","12695","12037", "15077", "15127", "19905", "12061", "5314", "16090", "11212", "11124"];
  disgustedFoodIDs: any=["9316", "12220", "12155","12695","12037", "15077", "15127", "19905", "12061", "5314", "16090", "11212", "11124"];

  detector1: any;

  title: any="EMOTION DETECTION"
  fridge: any=[];

  checkEmotion: boolean=false;
  preliminary: boolean=true;
  foodChoices: boolean=false;

  userId: string;

  emotionId: string="-1";
  emotionValue: string="-1";

  emotionFoods: any=[];
  recipes: any=[];
  emotionsArray: any=[];

  foodEntry: any;
  
  @ViewChild(Navbar) navBar: Navbar;

  constructor(public navCtrl: NavController, public navParams: NavParams, public emotionNutrientRestService: EmotionNutrientRestServiceProvider,
    public angularFireAuth: AngularFireAuth, public angularFireStore: AngularFirestore, public iab: InAppBrowser) {

    this.foodEntry=this.navParams.get("foodEntry");
    if(this.foodEntry!==undefined){
      this.title="CHECK CURRENT EMOTION AFTER EATING "+this.foodEntry.food.foodName;
    }

    var a = this;

    var divRoot=document.querySelector("#affdex_elements");
    var width = 640;
    var height = 480;
    var faceMode = affdex.FaceDetectorMode.LARGE_FACES;

    this.detector1 = new affdex.CameraDetector(divRoot, width, height, faceMode);

    this.detector1.detectAllEmotions();

    this.detector1.addEventListener("onInitializeSuccess", function() {
      console.log("The detector reports initialized");
    });

    this.detector1.addEventListener("onWebcamConnectSuccess", function() {
      console.log("Webcam access allowed");
    });
    
    //Add a callback to notify when camera access is denied
    this.detector1.addEventListener("onWebcamConnectFailure", function() {
      console.log("Webcam access denied");
      document.querySelector("#one").innerHTML="Please enable your camera access.";
      document.querySelector("#two").innerHTML="";
    });

    this.detector1.addEventListener("onStopSuccess", function() {
      console.log("The detector reports stopped");
    });

    this.detector1.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
      if (faces.length > 0) {
        var emotionsJSON=faces[0].emotions;
        let joy=emotionsJSON.joy;
        let sadness=emotionsJSON.sadness;
        let disgust=emotionsJSON.disgust-30;
        let anger=emotionsJSON.anger;
        let fear=emotionsJSON.fear;
        /*
        Happy: 0
        Sad: 1
        Angry: 2
        Disgusted: 3
        Scared: 4
        Stressed: 5
        Bored: 6
        Distressed: 7*/
        let emotions=[
          {
            name:"joy", 
            number:joy
          }, {
            name:"sadness", 
            number:sadness
          }, {
            name:"disgust", 
            number:disgust
          }, {
            name:"anger", 
            number:anger
          }, {
            name:"fear", 
            number:fear
          }];
        let maxEmotionNumber=Math.max.apply(Math, emotions.map(function(o) { return o.number; }));
        let maxEmotion=emotions[emotions.findIndex(x => x.number ===maxEmotionNumber)].name;
        if (maxEmotion=="joy") a.emotionId="0";
        else if(maxEmotion=="sadness") a.emotionId="1";
        else if(maxEmotion=="disgust") a.emotionId="3";
        else if(maxEmotion=="anger") a.emotionId="2";
        else if(maxEmotion=="fear") a.emotionId="4";

        a.emotionValue=maxEmotionNumber.toString();

        if (emotionsJSON.engagement<0.08){
          a.emotionId="6";
          a.emotionValue=emotionsJSON.engagement.toString();
          document.querySelector('#one').innerHTML = "<span>Are you feeling bored?</span><br />";
        }else{
          document.querySelector('#one').innerHTML = "<span>Are you feeling " +maxEmotion + "?</span><br />";
        }
        document.querySelector("#two").innerHTML="";
        a.checkEmotion=true;
        a.onStop();
      } else{
        document.querySelector("#one").innerHTML="No faces found!";
        document.querySelector("#two").innerHTML="";
      }
    });

    this.onStart();
  }

   onStart() {
    if (this.detector1 && !this.detector1.isRunning) {
      this.detector1.start(JSSDK.Assets.wasm);
    }
    console.log("Clicked the start button");
  }
  
  //function executes when the Stop button is pushed.
  onStop() {
    console.log("Clicked the stop button");
    if (this.detector1 && this.detector1.isRunning) {
      this.detector1.removeEventListener();
      this.detector1.stop();
    }
  };
  
  //function executes when the Reset button is pushed.
  onReset() {
    console.log("Clicked the reset button");
    if (this.detector1 && this.detector1.isRunning) {
      this.detector1.reset();
    }
  };
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad FacialEmotionPage');
    this.angularFireAuth.authState.subscribe(res => {
      if (res && res.uid) {
        console.log("HERE AGAIN");
        this.userId=res.uid;
      }
    });
  }

  ionViewDidLeave(){
    this.onStop();
    this.onReset();
  }

  setBackButtonAction(){
    this.navBar.backButtonClick = () => {
       this.navCtrl.pop()
    }
 }

yesEmotion(){
  if(this.foodEntry==null){
    console.log("NO FOOD ENTRY");
    this.checkEmotion=false;
    this.preliminary=true;
    document.querySelector("#one").innerHTML="";
    document.querySelector("#two").innerHTML="Checking your fridge for food which corresponds with your emotions...";
    
        console.log("HERE AGAIN");
        this.angularFireStore.firestore.doc('/users/'+this.userId).collection('fridge').get().then(docSnapshot => {
          if (docSnapshot) {
            console.log("USER: "+JSON.stringify(docSnapshot.docs.map(doc => doc.data())));
            this.getFoodForMood(docSnapshot.docs.map(doc => doc.data()));
          }
        });
      
  } else{
    console.log("FOOD ENTRY");
    this.foodEntry.finalEmotion=this.emotionId;
    this.foodEntry.finalEmotionValue=this.emotionValue;
    let foodEntries = this.angularFireStore.doc<any>('users/' + this.userId).collection('foodEntries');
    foodEntries.doc(this.foodEntry.time).set(this.foodEntry).then((res)=>{
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
      if(this.foodEntry.initialEmotion=="0"){
        if(this.foodEntry.finalEmotion=="0" && this.foodEntry.finalEmotionValue>=this.foodEntry.initialEmotionValue){
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "0")
        } else if(this.foodEntry.finalEmotion=="0" && this.foodEntry.finalEmotionValue<this.foodEntry.initialEmotionValue){
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "8")
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "9")
        } else {
          if(this.foodEntry.finalEmotion!=="0"){
            this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, (parseInt(this.foodEntry.finalEmotion)+8).toString())
          }
        }
      } else if(this.foodEntry.initialEmotion=="1"){
        if(this.foodEntry.finalEmotion=="1" && this.foodEntry.finalEmotionValue>=this.foodEntry.initialEmotionValue){
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "9")
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "8")
        } else if(this.foodEntry.finalEmotion=="1" && this.foodEntry.finalEmotionValue<this.foodEntry.initialEmotionValue){
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "1")
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "0")
        } else {
          if(this.foodEntry.finalEmotion!=="1"){
            if(this.foodEntry.finalEmotion=="0"){
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "1");
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "0");
            } else{
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, (parseInt(this.foodEntry.finalEmotion)+8).toString());
            }
          }
        }
      } else if(this.foodEntry.initialEmotion=="2"){
        if(this.foodEntry.finalEmotion=="2" && this.foodEntry.finalEmotionValue>=this.foodEntry.initialEmotionValue){
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "10")
        } else if(this.foodEntry.finalEmotion=="2" && this.foodEntry.finalEmotionValue<this.foodEntry.initialEmotionValue){
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "2")
        } else {
          if(this.foodEntry.finalEmotion!=="2"){
            if(this.foodEntry.finalEmotion=="0"){
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "2");
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "0");
            } else{
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, (parseInt(this.foodEntry.finalEmotion)+8).toString());
            }
          }
        }
      } else if(this.foodEntry.initialEmotion=="3"){
        if(this.foodEntry.finalEmotion=="3" && this.foodEntry.finalEmotionValue>=this.foodEntry.initialEmotionValue){
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "11")
        } else if(this.foodEntry.finalEmotion=="3" && this.foodEntry.finalEmotionValue<this.foodEntry.initialEmotionValue){
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "3")
        } else {
          if(this.foodEntry.finalEmotion!=="3"){
            if(this.foodEntry.finalEmotion=="0"){
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "3");
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "0");
            } else{
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, (parseInt(this.foodEntry.finalEmotion)+8).toString());
            }
          }
        }
      } else if(this.foodEntry.initialEmotion=="4"){
        if(this.foodEntry.finalEmotion=="4" && this.foodEntry.finalEmotionValue>=this.foodEntry.initialEmotionValue){
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "12")
        } else if(this.foodEntry.finalEmotion=="4" && this.foodEntry.finalEmotionValue<this.foodEntry.initialEmotionValue){
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "4")
        } else {
          if(this.foodEntry.finalEmotion!=="4"){
            if(this.foodEntry.finalEmotion=="0"){
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "4");
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "0");
            } else{
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, (parseInt(this.foodEntry.finalEmotion)+8).toString());
            }
          }
        }
      } else if(this.foodEntry.initialEmotion=="5"){
        if(this.foodEntry.finalEmotion=="5" && this.foodEntry.finalEmotionValue>=this.foodEntry.initialEmotionValue){
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "13")
        } else if(this.foodEntry.finalEmotion=="5" && this.foodEntry.finalEmotionValue<this.foodEntry.initialEmotionValue){
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "5")
        } else {
          if(this.foodEntry.finalEmotion!=="5"){
            if(this.foodEntry.finalEmotion=="0"){
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "5");
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "0");
            } else{
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, (parseInt(this.foodEntry.finalEmotion)+8).toString());
            }
          }
        }
      } else if(this.foodEntry.initialEmotion=="6"){
        if(this.foodEntry.finalEmotion=="6" && this.foodEntry.finalEmotionValue>=this.foodEntry.initialEmotionValue){
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "14")
        } else if(this.foodEntry.finalEmotion=="6" && this.foodEntry.finalEmotionValue<this.foodEntry.initialEmotionValue){
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "6")
        } else {
          if(this.foodEntry.finalEmotion!=="6"){
            if(this.foodEntry.finalEmotion=="0"){
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "6");
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "0");
            } else{
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, (parseInt(this.foodEntry.finalEmotion)+8).toString());
            }
          }
        }
      } else if(this.foodEntry.initialEmotion=="7"){
        if(this.foodEntry.finalEmotion=="7" && this.foodEntry.finalEmotionValue>=this.foodEntry.initialEmotionValue){
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "15")
        } else if(this.foodEntry.finalEmotion=="7" && this.foodEntry.finalEmotionValue<this.foodEntry.initialEmotionValue){
          this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "7")
        } else {
          if(this.foodEntry.finalEmotion!=="7"){
            if(this.foodEntry.finalEmotion=="0"){
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "7");
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, "0");
            } else{
              this.emotionNutrientRestService.learn(this.foodEntry.food.ingredientCode, (parseInt(this.foodEntry.finalEmotion)+8).toString());
            }
          }
        }
      }
      this.navCtrl.pop();
    }); 
  }
 }

 async getFoodForMood(fridge){
  if(fridge!==null && fridge.length>0){
    this.preliminary=true;
    this.emotionNutrientRestService.initUser().subscribe(
      data => {
        console.log("INIT USER FACIAL EMOTION: "+JSON.stringify(data));
          this.angularFireStore.firestore.doc('/users/'+this.userId).collection('fridge').get().then(docSnapshot => {
            if(docSnapshot){
              var fridgeFoods=docSnapshot.docs.map(doc => doc.data());
              console.log("FRIDGE FOODS: "+JSON.stringify(fridgeFoods));
              var index=0;
              for (let fridgeFood of fridgeFoods){
                index++;
                if(fridgeFood.quantity>0){
                  this.emotionNutrientRestService.predictEmotionForSpecificFood(fridgeFood).subscribe(
                    result => {
                      console.log("PREDICT DATA: " +fridgeFood.ingredientCode+" "+JSON.stringify(result));
                      let data=result["mood"];
                      console.log("DATA FOOD: "+data);
                      console.log(index);
                      if(data==this.emotionId){
                        this.emotionFoods.push(fridgeFood);
                      }
                      if(index==fridgeFoods.length){
                        console.log("LAST ONE");
                        this.foodChoices=true;
                        this.preliminary=false;
                        this.checkEmotion=false;
                        if(this.emotionFoods.length==0){
                          console.log("NOTHING");
                          document.querySelector("#three").innerHTML="There is no food in your fridge to help with your current emotion! Consider buying some of these ingredients. Click on each to see a few recipes of them."
                          if(this.emotionId=="0"){
                            for(let happyFoodID of this.happyFoodIDs){
                              var res = foodNutritionData.foodData.filter(obj => {
                                return obj.Ingredient_Code === happyFoodID
                              })[0];
                             
                              this.emotionFoods.push({
                                foodName: res.Ingredient_Name,
                                ingredientCode: res.Ingredient_Code
                              });
                            }
                          } else if(this.emotionId=="1"){
                            for(let sadFoodID of this.sadFoodIDs){
                              var res = foodNutritionData.foodData.filter(obj => {
                                return obj.Ingredient_Code === sadFoodID
                              })[0];
                              this.emotionFoods.push({
                                foodName: res.Ingredient_Name,
                                ingredientCode: res.Ingredient_Code
                              });
                            }
                          } else if(this.emotionId=="2"){
                            for(let happyFoodID of this.angryFoodIDs){
                              var res = foodNutritionData.foodData.filter(obj => {
                                return obj.Ingredient_Code === happyFoodID
                              })[0];
                              this.emotionFoods.push({
                                foodName: res.Ingredient_Name,
                                ingredientCode: res.Ingredient_Code
                              });
                            }
                          } else if(this.emotionId=="3"){
                            for(let happyFoodID of this.disgustedFoodIDs){
                              var res = foodNutritionData.foodData.filter(obj => {
                                return obj.Ingredient_Code === happyFoodID
                              })[0];
                              this.emotionFoods.push({
                                foodName: res.Ingredient_Name,
                                ingredientCode: res.Ingredient_Code
                              });
                            }
                          } else if(this.emotionId=="4"){
                            for(let happyFoodID of this.scaredFoodIDs){
                              var res = foodNutritionData.foodData.filter(obj => {
                                return obj.Ingredient_Code === happyFoodID
                              })[0];
                              this.emotionFoods.push({
                                foodName: res.Ingredient_Name,
                                ingredientCode: res.Ingredient_Code
                              });
                            }
                          } else if(this.emotionId=="5"){
                            for(let happyFoodID of this.stressedFoodIDs){
                              var res = foodNutritionData.foodData.filter(obj => {
                                return obj.Ingredient_Code === happyFoodID
                              })[0];
                              this.emotionFoods.push({
                                foodName: res.Ingredient_Name,
                                ingredientCode: res.Ingredient_Code
                              });
                            }
                          } else if(this.emotionId=="6"){
                            for(let happyFoodID of this.boredFoodIDs){
                              var res = foodNutritionData.foodData.filter(obj => {
                                return obj.Ingredient_Code === happyFoodID
                              })[0];
                              this.emotionFoods.push({
                                foodName: res.Ingredient_Name,
                                ingredientCode: res.Ingredient_Code
                              });
                            }
                          } else if(this.emotionId=="7"){
                            for(let happyFoodID of this.distressedFoodIDs){
                              var res = foodNutritionData.foodData.filter(obj => {
                                return obj.Ingredient_Code === happyFoodID
                              })[0];
                              this.emotionFoods.push({
                                foodName: res.Ingredient_Name,
                                ingredientCode: res.Ingredient_Code
                              });
                            }
                          }
                        }
                      }
                    },
                    error=>{
                      console.log("PREDICT ERROR: " +JSON.stringify(error));
                      index++;
                    }
                  );
                }
              }
              console.log("HEREEE");
            }
          });
      },
      error=>{
        console.log("ERROR: " +JSON.stringify(error));
      }
    );
  }else{
    this.preliminary=true;
    document.querySelector("#two").innerHTML="There is no food in your fridge!";
  }
 }

  noEmotion(){

  }

  getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
      indexes.push(i);
    }
    return indexes;
  }

  getRecipes(selectedFood){
    var baseURL="https://www.bigoven.com/recipes/";
    let ingredientName=selectedFood.foodName;
    var words = ingredientName.split(" ");
    for (var i =0; i<words.length; i++){
      if(i==words.length-1){
        baseURL+=words[i];
      }else{
        baseURL+=words[i]+"%20";
      }
    }
    baseURL+="/best";
    const browser = this.iab.create(baseURL);
    browser.show();
  }

}
