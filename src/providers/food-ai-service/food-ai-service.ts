import { HttpClient} from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { FirebaseAuthServiceProvider } from '../firebase-auth-service/firebase-auth-service';
import { File } from '@ionic-native/file/ngx';  
import * as Clarifai from 'clarifai'
import { foodNutritionData } from '../../data/foodNutritionData';

/*
  Generated class for the FoodAiServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FoodAiServiceProvider {

  response: any;
  data: any;
  logMealApiKey: string;
  logMealId: string;
  uid: string;

  filePath: any;

  constructor(public http: HttpClient, public angularFireAuth: AngularFireAuth, public firestore: AngularFirestore,
    public firebaseAuthService: FirebaseAuthServiceProvider, public file: File) {
    console.log('Hello FoodAiServiceProvider Provider');
  }

  detectImage(url): any{

    const app = new Clarifai.App({
      apiKey: '1a915dd5151349768d67a60d780065a9'
     });

     app.models.predict(Clarifai.FOOD_MODEL, 
      url).then(
        function(response) {
          console.log(JSON.stringify(response));
          let food=response.outputs[0].data.concepts[0].name;
          return food;
          //maybe show a list of things with apple and ask the user to identify which one it is
        },
        function(err) {
          console.error("FOOD ERROR: "+JSON.stringify(err));
        }
      );
  }

}