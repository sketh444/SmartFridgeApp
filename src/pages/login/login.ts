import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FirebaseAuthServiceProvider } from '../../providers/firebase-auth-service/firebase-auth-service';
import { TabsPage } from '../tabs/tabs';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LogInPage {

  emailAddress:string;
  password:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public firebaseAuthService: FirebaseAuthServiceProvider) {
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  beginLogIn(){
    if(this.emailAddress && this.password){
      this.firebaseAuthService.signIn(this.emailAddress, this.password).then((res) => {
          this.navCtrl.push(TabsPage, {}).then(()=>{
            const index = this.navCtrl.getActive().index;
            this.navCtrl.remove(0, index);
          });
      }).catch((error) => {
        let toast = this.toastCtrl.create({
          message: error.message,
          duration: 3000
        });
        toast.present();
      })
    }else{
      let toast = this.toastCtrl.create({
                        message: 'Please enter all fields.',
                        duration: 3000
                      });
                      toast.present();
    }
  }

  forgotPassword(){
    this.navCtrl.push(ForgotPasswordPage, {});
  }

}
