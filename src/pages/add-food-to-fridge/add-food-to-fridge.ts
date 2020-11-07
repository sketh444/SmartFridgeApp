import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { foodNutritionData } from '../../data/foodNutritionData';
import { FoodNutrientsProvider } from '../../providers/food-nutrients/food-nutrients';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Food } from '../../objects/food';
/**
 * Generated class for the AddFoodToFridgePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-food-to-fridge',
  templateUrl: 'add-food-to-fridge.html',
})
export class AddFoodToFridgePage {

  foodNutrition: any=[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public foodNutrientsService: FoodNutrientsProvider, public alertCtrl: AlertController, public firestore: AngularFirestore, public auth: AngularFireAuth) {
   
  }

  async ngOnInit() {
    this.foodNutrition = foodNutritionData.foodData;
  }

  async initializeItems(): Promise<any> {
    const foodList = await foodNutritionData.foodData;
    return foodList;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddFoodToFridgePage');
  }

  async filterList(evt) {
    const searchTerm = evt.srcElement.value;
    if(searchTerm==""){
      this.foodNutrition = await this.initializeItems();
    }else{
      if (!searchTerm) {
        return;
      }

      this.foodNutrition = this.foodNutrition.filter(currentFood => {
        if (currentFood.Ingredient_Name && searchTerm) {
          return (currentFood.Ingredient_Name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
        }
      });
    }
  }

  giveAlert(data){
    alert(data);
  }

  async addFoodItem(food){
    let alert = this.alertCtrl.create({
      title: 'Add Food',
      message: 'Would you like to add '+food.Ingredient_Name+' to your fridge food list?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.auth.authState.subscribe(user => {
              if (user) {
                let userId = user.uid
                let fridge = this.firestore.doc<any>('users/' + userId).collection('fridge');
                this.firestore.firestore.doc('/users/'+userId+'/fridge/'+food.Ingredient_Code).get().then(docSnapshot => {
                  if (docSnapshot.exists) {
                    let data=docSnapshot.data();
                    let quantity=data.quantity+1;
                    fridge.doc(food.Ingredient_Code).set({
                      ingredientCode: food.Ingredient_Code,
                      foodName: food.Ingredient_Name,
                      quantity: quantity
                    }).then((res)=>{
                      this.navCtrl.pop();
                    }); 
                  } else {
                    fridge.doc(food.Ingredient_Code).set({
                      ingredientCode: food.Ingredient_Code,
                      foodName: food.Ingredient_Name,
                      quantity: 1
                    }).then((res)=>{
                      this.navCtrl.pop();
                    });
                  }
                });
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

}
