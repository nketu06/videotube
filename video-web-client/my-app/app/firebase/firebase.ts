// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
import {getAuth,signInWithPopup,GoogleAuthProvider,onAuthStateChanged,User} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASW3LeETMxnZJSWWKmT3tV3Ww6hzbYe24",
  authDomain: "video-pro-a4e6c.firebaseapp.com",
  projectId: "video-pro-a4e6c",
  appId: "1:1089148259263:web:deccc6d164a6bea268af0a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth =getAuth(app);
export const functions=getFunctions();
export function signInWithGoogle(){
    return signInWithPopup(auth,new GoogleAuthProvider());
}

export function signOut(){
    return auth.signOut();
}

export function onAuthStateChangedHelper(callback:(user: User|null)=>void){
    return onAuthStateChanged(auth,callback); 
}