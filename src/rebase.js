// import firebase from "firebase/app";
// import firebase from "firebase/database";
import firebase, { firestore } from "firebase";
import rebase from "re-base";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_SENDER_APP_ID
};
const settings = { timestampsInSnapshots: true };
// var firebaseConfig = {
//   apiKey: "AIzaSyCxBrkcbwT62G-FgJDyyiCXkTjDxRIR5JY",
//   authDomain: "lottery-us1.firebaseapp.com",
//   databaseURL: "https://lottery-us1.firebaseio.com",
//   projectId: "lottery-us1",
//   storageBucket: "",
//   messagingSenderId: "369658436381",
//   appId: "1:369658436381:web:cf190c11a3a11055"
// };
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// export default firebase;
const app = firebase.initializeApp(firebaseConfig);
firestore.settings(settings);
const db = rebase.createClass(app.database());
//const firestore = app.firestore();
//const storage = app.storage();
//const auth = app.auth();
export default db;
