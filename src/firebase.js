import firebase from "firebase";
// import firebase from "firebase/database";
// import firebase, { firestore } from "firebase";
// import rebase from "re-base";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_SENDER_APP_ID
};
const log = console.log;
let resInit = firebase.initializeApp(firebaseConfig);
// log("firebase:", firebase, "config:", JSON.stringify(firebaseConfig), "firebase.initialzeApp", resInit);
const firestore = firebase.firestore();
// Remove the warning about timstamps change.
if (!firestore) log("NO firestore:", firestore);
// let settings_ = { timestampsInSnapshots: true };
// let settings_ = {  };
// firestore.settings(settings_);

const auth = firebase.auth();
if (!auth) log("NO auth:", auth);
const providerGoogle = new firebase.auth.GoogleAuthProvider();
// log("providerGoogle", providerGoogle);
const signInWithGoogle = () => auth.signInWithPopup(providerGoogle);
const signInWithGoogleRedirect = () => auth.signInWithRedirect(providerGoogle);
// log("signInWithGoogle:", signInWithGoogle);
//onclick=auth.signInWithPopup(signInWithGoogle);
// export { firebase, firestore, auth, providerGoogle, signInWithGoogle };
export { firebase, firestore, auth, providerGoogle, signInWithGoogle, signInWithGoogleRedirect };
