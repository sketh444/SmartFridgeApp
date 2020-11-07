import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../../objects/user';

/*
  Generated class for the FirebaseAuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseAuthServiceProvider {

  userData: any;

  constructor(public angularFireAuth: AngularFireAuth, public angularFirestore: AngularFirestore, public ngZone: NgZone) {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  // Login in with email/password
  signIn(email, password) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password)
  }

  // Register user with email/password
  registerUser(email, password) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password)
  }

  // Recover password
  passwordRecover(passwordResetEmail, toastCtrl) {
    return this.angularFireAuth.auth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      let toast = toastCtrl.create({
        message: 'Email sent to recover your password.',
        duration: 3000
      });
      toast.present();
    }).catch((error) => {
      let toast = toastCtrl.create({
        message: error.message,
        duration: 3000
      });
      toast.present();
    })
  }
  // Auth providers
  authLogin(provider) {
    return this.angularFireAuth.auth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          
        })
      this.setUserData(result.user);
    }).catch((error) => {
      window.alert(error)
    })
  }

  // Store user in localStorage
  setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(`users/${user.uid}`);
    return userRef.set(user, {
      merge: true
    })
  }

  // Sign-out 
  signOut() {
    return this.angularFireAuth.auth.signOut();
  }

}
