import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FirebaseAuthServiceProvider} from './../../providers/firebase-auth-service/firebase-auth-service';
import {TabsPage} from '../tabs/tabs';
import {SignUpLogInPage} from '../signuplogin/signuplogin';
import {AngularFireAuthModule, AngularFireAuth} from 'angularfire2/auth'
import { first, tap } from 'rxjs/operators';

/**
 * Generated class for the SplashPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseAuthService: FirebaseAuthServiceProvider, public angularFireAuth: AngularFireAuth) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');
    this.angularFireAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.navCtrl.push(TabsPage, {}).then(()=>{
          const index = this.navCtrl.getActive().index;
          this.navCtrl.remove(0, index);
        });
      } else {
        this.navCtrl.push(SignUpLogInPage, {}).then(()=>{
          const index = this.navCtrl.getActive().index;
          this.navCtrl.remove(0, index);
        });
      }
    });
  }

}
