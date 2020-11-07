import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { l } from '@angular/core/src/render3';
import { Observable } from 'rxjs';
import {_throw} from 'rxjs/observable/throw';
import { catchError, retry } from 'rxjs/operators';
import { Http } from '@angular/http';
/*
  Generated class for the DailyNutrientServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DailyNutrientServiceProvider {

  gender: any=['Female','Male'];

  data: any;
  res: any;

  constructor(public http: HttpClient, public angularFireAuth: AngularFireAuth, public firestore: AngularFirestore) {
    console.log('Hello DailyNutrientServiceProvider Provider');
    

  }

  getDailyNutrients(){
    this.angularFireAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.firestore.firestore.doc('/users/'+res.uid).get().then(docSnapshot => {
          if (docSnapshot.exists) {
            this.data=docSnapshot.data();

            let gender=this.data.gender;
            let height=this.data.height;
            let weight=this.data.weight;
            let age=this.data.age;

            let genderString=""
            if(gender==0) genderString="FEMALE";
            else genderString="MALE";
          }
        });
      }
    });
  }

  toFeet(n) {
    var realFeet = ((n*0.393700) / 12);
    var feet = Math.floor(realFeet);
    var inches = Math.round((realFeet - feet) * 12);
    return feet;
  }

  toInches(n) {
    var realFeet = ((n*0.393700) / 12);
    var feet = Math.floor(realFeet);
    var inches = Math.round((realFeet - feet) * 12);
    return inches;
  }

  kToLbs(pK) {
    var nearExact = pK/0.45359237;
    var lbs = Math.floor(nearExact);
    var oz = (nearExact - lbs) * 16;
    return lbs;
}

}
