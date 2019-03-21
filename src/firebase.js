import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyAaPX3QWoqKFRpSisMiuchcYFWRVdGmQ5Y",
  authDomain: "slack-fake.firebaseapp.com",
  databaseURL: "https://slack-fake.firebaseio.com",
  projectId: "slack-fake",
  storageBucket: "slack-fake.appspot.com",
  messagingSenderId: "325318847516"
};

firebase.initializeApp(config);

export default firebase;
