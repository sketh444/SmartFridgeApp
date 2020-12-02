import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { foodNutritionData } from '../../data/foodNutritionData';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { FirebaseAuthServiceProvider } from '../../providers/firebase-auth-service/firebase-auth-service';
import { User } from '../../objects/user';
import { TabsPage } from '../tabs/tabs';
import { EmotionNutrientRestServiceProvider } from '../../providers/emotion-nutrient-rest-service/emotion-nutrient-rest-service';

/**
 * Generated class for the OnboardingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingPage {

  index: number=0;
  foodList: any=[];
  allergyList: any=[];
  user: any;

  email: any;
  password: any;

  generalDetailsDiv: boolean=true;
  allergiesDiv: boolean=false;
  typeOfDietDiv: boolean=false;
  emotionsDiv: boolean=false;
  goalsDiv: boolean=false;

  typesOfDiet: any=["Vegan", "Vegetarian", "Non-Vegetarian"];

  typeOfDiet: number=0;

  gender: number;
  height: number;
  weight: number;
  age: number;

  emotionsQuestion: string="What foods would make you happy?";
  emotionFoods: any=[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public angularFireAuth: AngularFireAuth, public angularFireStore: AngularFirestore, public toastCtrl: ToastController, public firebaseAuthService: FirebaseAuthServiceProvider,
    public emotionNutrientRestService: EmotionNutrientRestServiceProvider) {
    this.user=navParams.get('user');
    this.email=navParams.get('email');
    this.password=navParams.get('password');
  }

  ionViewDidLoad() {}

  next(){
    if(this.index==0){
      this.user.gender=this.gender;
      this.user.height=this.height;
      this.user.weight=this.weight;
      this.user.age=this.age;
      if(this.user.gender==null || this.user.height==null ||this.user.weight==null ||this.user.age==null){
        let toast = this.toastCtrl.create({
          message: "Please enter all of the fields",
          duration: 3000
        });
        toast.present();
      } else{
        this.index++;
        this.changeScreenComponents();
      }
    }else if (this.index==1){
      this.index++;
      this.changeScreenComponents();
    }else if (this.index==2){
      this.index++;
      this.changeScreenComponents();
    }else if (this.index==3){
      if(this.user.happyFoods.length==0){
        let toast = this.toastCtrl.create({
          message: "Please enter the foods of your selection.",
          duration: 3000
        });
        toast.present();
      } else{
        this.index++;
        this.changeScreenComponents();
      }
    }else if (this.index==4){
      if(this.user.sadFoods.length==0){
        let toast = this.toastCtrl.create({
          message: "Please enter the foods of your selection.",
          duration: 3000
        });
        toast.present();
      } else{
        this.index++;
        this.changeScreenComponents();
      }
    }else if (this.index==5){
      if(this.user.angryFoods.length==0){
        let toast = this.toastCtrl.create({
          message: "Please enter the foods of your selection.",
          duration: 3000
        });
        toast.present();
      } else{
        this.index++;
        this.changeScreenComponents();
      }
    }else if (this.index==6){
      if(this.user.disgustedFoods.length==0){
        let toast = this.toastCtrl.create({
          message: "Please enter the foods of your selection.",
          duration: 3000
        });
        toast.present();
      } else{
        this.index++;
        this.changeScreenComponents();
      }
    }else if (this.index==7){
      if(this.user.scaredFoods.length==0){
        let toast = this.toastCtrl.create({
          message: "Please enter the foods of your selection.",
          duration: 3000
        });
        toast.present();
      } else{
        this.index++;
        this.changeScreenComponents();
      }
    }else if (this.index==8){
      if(this.user.stressedFoods.length==0){
        let toast = this.toastCtrl.create({
          message: "Please enter the foods of your selection.",
          duration: 3000
        });
        toast.present();
      } else{
        this.index++;
        this.changeScreenComponents();
      }
    }else if (this.index==9){
      if(this.user.boredFoods.length==0){
        let toast = this.toastCtrl.create({
          message: "Please enter the foods of your selection.",
          duration: 3000
        });
        toast.present();
      } else{
        this.index++;
        this.changeScreenComponents();
      }
    }else if (this.index==10){
      if(this.user.distressedFoods.length==0){
        let toast = this.toastCtrl.create({
          message: "Please enter the foods of your selection.",
          duration: 3000
        });
        toast.present();
      } else{
        this.index++;
        this.changeScreenComponents();
      }
    }else if(this.index==11){
        this.register();
    }
  }

  async register(){
    this.firebaseAuthService.registerUser(this.email, this.password).then((res) => {
      this.user.uid=res.uid;
      this.firebaseAuthService.setUserData(this.user).then((userData)=>{
        this.emotionNutrientRestService.initUser().subscribe(
          data => {
            alert(JSON.stringify(data));
            this.emotionNutrientRestService.trainModelWhenOnboarding(this.user);
            this.navCtrl.push(TabsPage, {}).then(()=>{
              const index = this.navCtrl.getActive().index;
              this.navCtrl.remove(0, index);
            });
          },
          error => {
            alert(JSON.stringify(error));
          }
        );
      });
    });
  }

  back(){
    if(this.index!==0){
      this.index--;
      this.changeScreenComponents();
    } else{
      this.navCtrl.pop();
    }
  }

  async changeScreenComponents(){
    if(this.index==0){
      this.generalDetailsDiv=true;
      this.allergiesDiv=false;
    } else if(this.index==1){
      this.allergyList=this.user.allergies;
      this.allergiesDiv=true;
      this.generalDetailsDiv=false;
      this.typeOfDietDiv=false;
    } else if(this.index==2){
      this.allergiesDiv=false;
      this.typeOfDietDiv=true;
      this.emotionsDiv=false;
    } else if(this.index==3){
      this.emotionsDiv=true;
      this.typeOfDietDiv=false;
      
      this.foodList = await this.initializeItems();
      if(this.user.happyFoods==null){
        this.user.happyFoods=[];
      } 
      this.emotionFoods=[];
      this.emotionFoods=this.user.happyFoods;
      this.emotionsQuestion="You come home from work after a very rewarding day. You still feel energetic and want to reward yourself. What do you eat?";
    } else if(this.index==4){
      this.foodList = await this.initializeItems();
      if(this.user.sadFoods==null){
        this.user.sadFoods=[];
      } 
      this.emotionFoods=[];
      this.emotionFoods=this.user.sadFoods;
      this.emotionsQuestion="You recently had a falling out with your significant other, and are very sad about it. Would would you eat to feel happier?";
    } else if(this.index==5){
      this.foodList = await this.initializeItems();
      if(this.user.angryFoods==null){
        this.user.angryFoods=[];
      } 
      this.emotionFoods=[];
      this.emotionFoods=this.user.angryFoods;
      this.emotionsQuestion="You just had a massive fight with your roommate about her messy ways in the house, and she storms out. What do you eat to calm yourself down?";
    } else if(this.index==6){
      this.foodList = await this.initializeItems();
      if(this.user.disgustedFoods==null){
        this.user.disgustedFoods=[];
      } 
      this.emotionFoods=[];
      this.emotionFoods=this.user.disgustedFoods;
      this.emotionsQuestion="Your roommate has a stomach bug and is throwing up and you have to take care of her. Unfortunately, this means cleaning up after her. What would you eat to settle your stomach?";
    } else if(this.index==7){
      this.foodList = await this.initializeItems();
      if(this.user.scaredFoods==null){
        this.user.scaredFoods=[];
      } 
      this.emotionFoods=[];
      this.emotionFoods=this.user.scaredFoods;
      this.emotionsQuestion="You just watched a horror movie alone at night. However, you can't go to bed because you're very hungry. What would you eat to calm yourself down?";
    } else if(this.index==8){
      this.foodList = await this.initializeItems();
      if(this.user.stressedFoods==null){
        this.user.stressedFoods=[];
      } 
      this.emotionFoods=[];
      this.emotionFoods=this.user.stressedFoods;
      this.emotionsQuestion="A very urgent assignment is due tonight, and you're only halfway done. You're very stressed, and you need to calm yourself. What would you eat?";
    } else if(this.index==9){
      this.foodList = await this.initializeItems();
      if(this.user.boredFoods==null){
        this.user.boredFoods=[];
      } 
      this.emotionFoods=[];
      this.emotionFoods=this.user.boredFoods;
      this.emotionsQuestion="You feel bored and lethargic on a Friday night. What would you eat to boost your mood and energy?";
    } else if(this.index==10){
      this.foodList = await this.initializeItems();
      if(this.user.distressedFoods==null){
        this.user.distressedFoods=[];
      } 
      this.emotionFoods=[];
      this.emotionFoods=this.user.distressedFoods;
      this.emotionsQuestion="You recently learned that you were rejected from almost every college you applied to, but still have one decision to go. What would you eat to calm and center yourself?";
    }else if(this.index==11){
      this.emotionsDiv=false;
      this.goalsDiv=true;
    }
  }

  removeEmotionFood(emotionFood){
    alert("REMOVE EMOTION FOOD");
    var index1 = this.emotionFoods.indexOf(emotionFood);
    this.emotionFoods.splice(index1, 1);
    if(this.index==3) this.user.happyFoods=this.emotionFoods;
    if(this.index==4) this.user.sadFoods=this.emotionFoods;
    if(this.index==5) this.user.angryFoods=this.emotionFoods;
    if(this.index==6) this.user.disgustedFoods=this.emotionFoods;
    if(this.index==7) this.user.scaredFoods=this.emotionFoods;
    if(this.index==8) this.user.stressedFoods=this.emotionFoods;
    if(this.index==9) this.user.boredFoods=this.emotionFoods;
    if(this.index==10) this.user.distressedFoods=this.emotionFoods;
  }

  selectFoodForEmotion(food){
    if (this.emotionFoods.filter(e => e.ingredientCode === food.Ingredient_Code).length == 0) {
      if(this.index==3){
        let happyFood={
          foodName: food.Ingredient_Name,
          ingredientCode: food.Ingredient_Code
        }
        this.emotionFoods.push(happyFood);
        this.user.happyFoods=this.emotionFoods;
      } else if(this.index==4){
        let sadFood={
          foodName: food.Ingredient_Name,
          ingredientCode: food.Ingredient_Code
        }
        this.emotionFoods.push(sadFood);
        this.user.sadFoods=this.emotionFoods;
      } else if(this.index==5){
        let angryFood={
          foodName: food.Ingredient_Name,
          ingredientCode: food.Ingredient_Code
        }
        this.emotionFoods.push(angryFood);
        this.user.angryFoods=this.emotionFoods;
      } else if(this.index==6){
        let disgustedFood={
          foodName: food.Ingredient_Name,
          ingredientCode: food.Ingredient_Code
        }
        this.emotionFoods.push(disgustedFood);
        this.user.disgustedFoods=this.emotionFoods;
      } else if(this.index==7){
        let scaredFood={
          foodName: food.Ingredient_Name,
          ingredientCode: food.Ingredient_Code
        }
        this.emotionFoods.push(scaredFood);
        this.user.scaredFoods=this.emotionFoods;
      } else if(this.index==8){
        let stressedFood={
          foodName: food.Ingredient_Name,
          ingredientCode: food.Ingredient_Code
        }
        this.emotionFoods.push(stressedFood);
        this.user.stressedFoods=this.emotionFoods;
      } else if(this.index==9){
        let boredFood={
          foodName: food.Ingredient_Name,
          ingredientCode: food.Ingredient_Code
        }
        this.emotionFoods.push(boredFood);
        this.user.boredFoods=this.emotionFoods;
      } else if(this.index==10){
        let distressedFood={
          foodName: food.Ingredient_Name,
          ingredientCode: food.Ingredient_Code
        }
        this.emotionFoods.push(distressedFood);
        this.user.distressedFoods=this.emotionFoods;
      }
    }
  }

  async ngOnInit() {
    this.foodList = foodNutritionData.foodData;
  }

  async initializeItems(): Promise<any> {
    const foodList = await foodNutritionData.foodData;
    return foodList;
  }

  async filterList(evt) {
    const searchTerm = evt.srcElement.value;
    if(searchTerm==""){
      this.foodList = await this.initializeItems();
    }else{
      if (!searchTerm) {
        return;
      }
      this.foodList = this.foodList.filter(currentFood => {
        if (currentFood.Ingredient_Name && searchTerm) {
          return (currentFood.Ingredient_Name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
        }
      });
    }
  }

  addAllergyItem(food){
    if (this.allergyList.filter(e => e.ingredientCode === food.Ingredient_Code).length == 0) {
      let allergy={
        ingredientCode: food.Ingredient_Code,
        foodName: food.Ingredient_Name
      }
      this.allergyList.push(allergy);
      this.user.allergies=this.allergyList;
    }
  }

  removeAllergy(allergy){
    var index = this.allergyList.indexOf(allergy);
    this.allergyList.splice(index, 1);
    this.user.allergies=this.allergyList;
  }

  selectTypeOfDiet(value){
    this.typeOfDiet=value;
    this.user.typeOfDiet=this.typeOfDiet;
  }

  selectGender(gender){
    this.gender=gender;
    this.user.gender=this.gender;
  }

  selectGoal(goal){
    this.user.goal==goal;
  }

}
