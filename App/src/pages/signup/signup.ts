import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FirebaseAuthServiceProvider } from '../../providers/firebase-auth-service/firebase-auth-service';
import { TabsPage } from '../tabs/tabs';
import { User } from '../../objects/user';
import { FoodEntry } from '../../objects/foodEntry';
import { Food } from '../../objects/food';
import { OnboardingPage } from '../onboarding/onboarding';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class SignUpPage {

  name: string;
  email: string;
  password: string;
  repeatPassword: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseAuthService: FirebaseAuthServiceProvider, public toastCtrl: ToastController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  register(){
    if(this.password && this.name && this.email && this.repeatPassword){
      if(this.validateEmail(this.email)===true){
        if(this.repeatPassword===this.password){
          let foodEntries: any=[];
          let fridge: any=[];
          let groceryList: any=[];
          let allergies: any=[];
          let happyFoods: any=[];
          let sadFoods: any=[];
          let angryFoods: any=[];
          let disgustedFoods: any=[];
          let scaredFoods: any=[];
          let stressedFoods: any=[];
          let boredFoods: any=[];
          let distressedFoods: any=[];
          let contemptFoods: any=[];
          var userData={
            uid: "",
            name: this.name,
            allergies: allergies,
            typeOfDiet: 2,
            goal: 0,
            height: -1,
            weight: -1,
            age: -1,
            gender: -1,
            happyFoods: happyFoods,
            sadFoods: sadFoods,
            angryFoods: angryFoods,
            disgustedFoods: disgustedFoods,
            scaredFoods: scaredFoods,
            stressedFoods: stressedFoods,
            boredFoods: boredFoods,
            distressedFoods: distressedFoods,
            logMealApiKey: "",
            logMealId: ""
          }
          this.navCtrl.push(OnboardingPage, {
            user: userData,
            email: this.email,
            password: this.password
          });
        }else{
          let toast = this.toastCtrl.create({
              message: 'Your passwords do not match.',
              duration: 3000
          });
          toast.present();
        }
      }else{
        let toast = this.toastCtrl.create({
                        message: 'Please enter a valid email address.',
                        duration: 3000
                      });
                      toast.present();
                
      }
    }else{
       let toast = this.toastCtrl.create({
                        message: 'Please enter all fields.',
                        duration: 3000
                      });
                      toast.present();  
    }
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}
