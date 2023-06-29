import { initializeApp } from "firebase/app";
import { 
    getAuth,
    createUserWithEmailAndPassword ,
    updateProfile,signInWithEmailAndPassword,
    onAuthStateChanged,signOut} from 'firebase/auth';
import { getDatabase, ref, set ,child,update,push,onChildChanged,onChildAdded,off,serverTimestamp,onValue,remove,onChildRemoved,onDisconnect} from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDt5E4Nt3C6MsCXRFGiE_WVFGno0FfeLkM",
  authDomain: "talkative-e7a40.firebaseapp.com",
  projectId: "talkative-e7a40",
  storageBucket: "talkative-e7a40.appspot.com",
  messagingSenderId: "544906933122",
  appId: "1:544906933122:web:24bde010f4f79d0847d59b",
  databaseURL: "https://talkative-e7a40-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth();
const database = getDatabase(app);
export const storage = getStorage(app);
export {auth,push,createUserWithEmailAndPassword,updateProfile,ref,database,set,child,signInWithEmailAndPassword,onAuthStateChanged,signOut,update,onChildChanged,onChildAdded,off,serverTimestamp,getDatabase,onValue,remove,onChildRemoved,onDisconnect}