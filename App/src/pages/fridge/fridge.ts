import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { SignUpLogInPage } from '../signuplogin/signuplogin';
import { AddFoodToFridgePage } from '../add-food-to-fridge/add-food-to-fridge';
import { AddToGroceryListPage } from '../add-to-grocery-list/add-to-grocery-list';
import { foodNutritionData } from '../../data/foodNutritionData';
import { FirebaseAuthServiceProvider } from '../../providers/firebase-auth-service/firebase-auth-service';
​
/**
 * Generated class for the FridgePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
​
@IonicPage()
@Component({
  selector: 'page-fridge',
  templateUrl: 'fridge.html',
})
export class FridgePage {

  title: any;

  hideSeeAllFridgeButton: boolean=true;
  hideSeeAllGroceryListButton: boolean=true;

  firestoreFridgeList: any;
  firestoreFridgeReferenceList: any;

  groceryList: any;
  groceryReferenceList: any; 

  noGroceryList: boolean=false;
  noFridgeList: boolean=false;

  uid: any;
​
  constructor(public navCtrl: NavController, public navParams: NavParams, public angularFireStore: AngularFirestore, public angularFireAuth: AngularFireAuth, public alertController: AlertController,
    public firebaseAuthService: FirebaseAuthServiceProvider) {
    this.title = "Fridge"
  }

  ionViewDidLoad(){
    this.angularFireAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.uid=res.uid;
        this.firestoreFridgeList = this.angularFireStore.doc<any>('users/'+res.uid).collection('fridge').valueChanges();
        this.firestoreFridgeReferenceList=this.angularFireStore.doc<any>('users/'+res.uid).collection('fridge');

        if(this.firestoreFridgeList!==null){
          if (this.firestoreFridgeList.length>5){
            this.hideSeeAllFridgeButton=false;
          } else{
            this.hideSeeAllFridgeButton=true;
          }
        }else{
          this.hideSeeAllFridgeButton=true;
        }

        if(this.firestoreFridgeList!==null){
          if(this.firestoreFridgeList.length>0){
            this.noFridgeList=false;
          } else{
            this.noFridgeList=true;
          }
        } else{
          this.noFridgeList=true;
        }

        this.groceryList = this.angularFireStore.doc<any>('users/'+res.uid).collection('groceryList').valueChanges();
        this.groceryReferenceList=this.angularFireStore.doc<any>('users/'+res.uid).collection('groceryList');

        if(this.groceryList!==null){
          if(this.groceryList.length>5){
            this.hideSeeAllGroceryListButton=false;
          } else{
            this.hideSeeAllGroceryListButton=true;
          }
        }else{
          this.hideSeeAllGroceryListButton=true;
        }

        if(this.groceryList!==null){
          if(this.groceryList.length>0){
            this.noGroceryList=false;
          } else{
            this.noGroceryList=true;
          }
        } else{
          this.noGroceryList=true;
        }

      } else {
        this.navCtrl.push(SignUpLogInPage, {}).then(()=>{
          const index = this.navCtrl.getActive().index;
          this.navCtrl.remove(0, index);
        });
      }
    });
  }

  addFridgeItem(){
    this.navCtrl.push(AddFoodToFridgePage, {});
  }

  addGroceryListItem(){
    this.navCtrl.push(AddToGroceryListPage, {});
  }

  deleteFridgeItem(food){
    console.log("TO DELETE: "+`user/${this.uid}/fridge/${food.ingredientCode}`);
    this.angularFireStore.firestore.doc(`users/${this.uid}/fridge/${food.ingredientCode}`).delete().catch(error=>{
      console.log("DELETE ERROR: "+JSON.stringify(error));
    })
  }

}