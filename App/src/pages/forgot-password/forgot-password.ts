import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FirebaseAuthServiceProvider } from '../../providers/firebase-auth-service/firebase-auth-service';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  emailAddress: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseAuthService: FirebaseAuthServiceProvider, public toastCtrl: ToastController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  passwordRecover(){
    this.firebaseAuthService.passwordRecover(this.emailAddress, this.toastCtrl);
  }

}
