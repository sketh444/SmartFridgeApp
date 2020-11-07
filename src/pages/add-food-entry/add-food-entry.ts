import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { FoodAiServiceProvider } from '../../providers/food-ai-service/food-ai-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file/ngx'; 
import 'firebase/storage';
import firebase from 'firebase';
import { foodNutritionData } from '../../data/foodNutritionData';
import * as Clarifai from 'clarifai'
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FacialEmotionPage } from '../facial-emotion/facial-emotion';
/**
 * Generated class for the AddFoodEntryPage page.
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
  selector: 'page-add-food-entry',
  templateUrl: 'add-food-entry.html',
})
export class AddFoodEntryPage {

  detector1: any;
  emotionId: string="-1";
  emotionValue: string="-1";
  title: any="TAKE FOOD OUT OF FRIDGE";
  base64Image: string;
  userId: any;
  recognizedFoods: any;
  yesEmotionButtonText: string="YES, I AM FEELING THIS EMOTION";
  noEmotionButtonText: string="NO, I AM NOT FEELING THIS EMOTION";

  checkEmotion: boolean=false;
  preliminary: boolean=true;
  chooseFood: boolean=false;
  next: boolean=false;
  done: boolean=false;

  @ViewChild(Navbar) navBar: Navbar;

  constructor(public navCtrl: NavController, public navParams: NavParams, public foodAiService: FoodAiServiceProvider,
    public camera: Camera, public file: File, public angularFireAuth: AngularFireAuth, public angularFireStore: AngularFirestore,
    public localNotifications: LocalNotifications) {

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

  yesEmotion(){
    if(this.done==false){
      this.done=true;
      this.checkEmotion=true;
      this.preliminary=true;
      document.querySelector("#one").innerHTML="";
      document.querySelector("#two").innerHTML="Please select an option to take a picture of the food you just took out of your fridge.";
      this.yesEmotionButtonText="TAKE PHOTO";
      this.noEmotionButtonText="CHOOSE FROM GALLERY";
    } else{
      this.takePhoto();
    }
 }

 noEmotion(){
  if(this.done==false){
   
  } else{
    this.chooseFromGallery();
  }
}


 takePhoto(){
   this.getPhoto(0);
}

chooseFromGallery(){
  this.getPhoto(0);
}

async getPhoto(sourceType){
  const options: CameraOptions = {
    quality: 100,
    encodingType: this.camera.EncodingType.JPEG,
    saveToPhotoAlbum: true,
    sourceType: sourceType,
    destinationType: this.camera.DestinationType.DATA_URL
  }
  this.camera.getPicture(options).then((imageData) => {
    console.log("IMAGE DATA: "+imageData)
    this.base64Image = 'data:image/jpeg;base64,' + imageData;
    this.upload();
   }, (err) => {
    // Handle error
    alert("Error: "+err);
   })
}

upload() {
  this.preliminary=false;
  this.checkEmotion=false;
  this.next=true;
  var a=this;
  let storageRef = firebase.storage().ref();
  // Create a timestamp as filename

  const filename = Math.floor(Date.now() / 1000);

  // Create a reference to 'images/todays-date.jpg'

  const imageRef = storageRef.child(`images/${filename}.jpg`);

  imageRef.putString(this.base64Image, firebase.storage.StringFormat.DATA_URL)
    .then((snapshot)=> {
      // Do something here when the data is succesfully uploaded!
      const app = new Clarifai.App({
        apiKey: '1a915dd5151349768d67a60d780065a9'
       });
  
       app.models.predict(Clarifai.FOOD_MODEL, 
        snapshot.downloadURL).then(
          function(response) {
            console.log(JSON.stringify(response));
            let recognizedFood=response.outputs[0].data.concepts[0].name;
            a.next=false;
            a.chooseFood=true;
            a.recognizedFoods = foodNutritionData.foodData.filter(obj => {
              return obj.Ingredient_Name.toLowerCase().includes(recognizedFood.toLowerCase()) && !obj.Ingredient_Name.includes("Babyfood");
            });
          },
          function(err) {
            console.error("FOOD ERROR: "+JSON.stringify(err));
          }
        );
    });
}

selectFridgeItem(food){
  let fridge = this.angularFireStore.doc<any>('users/' + this.userId).collection('fridge');
  let foodEntries = this.angularFireStore.doc<any>('users/' + this.userId).collection('foodEntries');
  this.angularFireStore.firestore.doc('/users/'+this.userId+'/fridge/'+food.Ingredient_Code).get().then(docSnapshot => {
    if (docSnapshot.exists) {
      let data=docSnapshot.data();
      let quantity=data.quantity-1;
      fridge.doc(food.Ingredient_Code).set({
        ingredientCode: food.Ingredient_Code,
        foodName: food.Ingredient_Name,
        quantity: quantity
      }).then((res)=>{
        let foodie={
          quantity: 1,
          ingredientCode: food.Ingredient_Code,
          foodName:  food.Ingredient_Name
        }
        let foodEntry={
          food: foodie,
          time: Date.now().toString(),
          initialEmotion: this.emotionId,
          finalEmotion: "-1",
          initialEmotionValue: this.emotionValue,
          finalEmotionValue: "-1"
        }
        foodEntries.doc(foodEntry.time).set(foodEntry).then((res)=>{
          this.localNotifications.schedule({
            text: 'Please enter how you feel right now after eating '+food.Ingredient_Name+'!',
            trigger: {at: new Date(new Date().getTime() + 1800000)},
            sound: null
          });
          this.localNotifications.on("click").subscribe((notification) => {
            this.navCtrl.push(FacialEmotionPage, {
              foodEntry:foodEntry
            });
          });
          this.navCtrl.pop()
        }); 
      }); 
    } else{
      let foodie={
        quantity: 1,
        ingredientCode: food.Ingredient_Code,
        foodName:  food.Ingredient_Name
      }
      let foodEntry={
        food: foodie,
        time: Date.now().toString(),
        initialEmotion: this.emotionId,
        finalEmotion: "-1",
        initialEmotionValue: this.emotionValue,
        finalEmotionValue: "-1"
      }
      foodEntries.doc(foodEntry.time).set(foodEntry).then((res)=>{
        this.localNotifications.schedule({
          text: 'Please enter how you feel right now after eating '+food.Ingredient_Name+'!',
          trigger: {at: new Date(new Date().getTime() + 1800000)},
          sound: null
        });
        this.localNotifications.on("click").subscribe((notification) => {
          this.navCtrl.push(FacialEmotionPage, {
            foodEntry:foodEntry
          });
        });
        this.navCtrl.pop()
      }); 
    }
  });
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
  
  ionViewDidLeave(){
    this.onStop();
    this.onReset();
  }

  setBackButtonAction(){
    this.navBar.backButtonClick = () => {
       this.navCtrl.pop()
    }
 }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddFoodEntryPage');
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.userId=user.uid;
      }
    });
  }

}
