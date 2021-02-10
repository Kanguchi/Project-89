import * as firebase from 'firebase';
require('@firebase/firestore')

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyA9Zqu-jika3lWNMBeSzcAIOV3uQ7jMlvI",
    authDomain: "barter-app-7e211.firebaseapp.com",
    projectId: "barter-app-7e211",
    storageBucket: "barter-app-7e211.appspot.com",
    messagingSenderId: "616397809406",
    appId: "1:616397809406:web:56a57510666f6cf40327af"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var storage = firebase.storage();

export default firebase.firestore();