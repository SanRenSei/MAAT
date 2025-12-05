import { initializeApp } from "./firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from './firebase-auth.js'
import eventDispatcher from "../event/Dispatcher.js";

const firebaseConfig = {
  apiKey: "AIzaSyC0twQi1ONRbj4oRyLszKT4Dn81vUJESzc",
  authDomain: "wordsweeper-29c98.firebaseapp.com",
  projectId: "wordsweeper-29c98",
  storageBucket: "wordsweeper-29c98.firebasestorage.app",
  messagingSenderId: "486238719648",
  appId: "1:486238719648:web:7e4a01a9d3a9a8e80143c5"
};

class FirebaseAuth {

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth();
    this.currentUser = null;
    this.currentToken = null;

    onAuthStateChanged(this.auth, async user => {
      if (user) {
        console.log('RECOVER SESSION')
        this.currentUser = user;
        this.currentToken = await user.getIdToken();
        console.log(this.currentUser)
      } else {
        this.currentUser = null;
        this.currentToken = null;
      }
      eventDispatcher.dispatchEvent({type:'auth'});
    });
  }

  async doGoogleLogin() {
    console.log(GoogleAuthProvider)
    console.log(signInWithPopup)
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    this.currentUser = result.user;
    this.currentToken = await this.currentUser.getIdToken();
    console.log(this.currentUser);
    console.log(this.currentToken);
    return this.currentToken;
  }

  async getLoginStatus() {
    if (this.auth.currentUser) {
      this.currentUser = this.auth.currentUser;
      this.currentToken = await this.currentUser.getIdToken(true);
      return {
        loggedIn: true,
        token: this.currentToken,
        user: this.currentUser
      };
    }
    return { loggedIn: false };
  }

  async getValidToken() {
    if (!this.auth.currentUser) {
      return null;
    }
    this.currentToken = await this.auth.currentUser.getIdToken(true);
    return this.currentToken;
  }

  async logout() {
    await this.auth.signOut();
    this.currentUser = null;
    this.currentToken = null;
  }

}

const firebaseAuth = new FirebaseAuth();
export default firebaseAuth;