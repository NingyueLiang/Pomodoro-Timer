// use old version
// https://stackoverflow.com/questions/69143642/firebase-apps-length-of-undefined
// import firebase from "firebase/app"
import firebase from 'firebase/compat/app';
import "firebase/compat/auth"
// import "firebase/firestore"
import 'firebase/compat/firestore';



const clientCredentials = {
    apiKey: "AIzaSyCeNPFmLZCgrFtvtX2fD9iMps155S5bGMU",
    authDomain: "foocus-ec1af.firebaseapp.com",
    projectId: "foocus-ec1af",
    storageBucket: "foocus-ec1af.appspot.com",
    messagingSenderId: "606416449382",
    appId: "1:606416449382:web:d24afa7b71bfd94d1d62a7",
    measurementId: "G-QQRP5QGTLV"
  };
  
  if (!firebase.apps.length){
      firebase.initializeApp(clientCredentials);
  }

  export default firebase;