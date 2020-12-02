import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignUpPage } from '../signup/signup';
import { LogInPage } from '../login/login';

/**
 * Generated class for the SignuploginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signuplogin',
  templateUrl: 'signuplogin.html',
})
export class SignUpLogInPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignuploginPage');
  }
  openRegister(event){
    this.navCtrl.push(SignUpPage, {});
  }

  openLogIn(event){
    this.navCtrl.push(LogInPage,{});
  }

}
