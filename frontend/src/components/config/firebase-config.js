import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCnzYyXtuq0yB13-vnU15dgAJfLVOFDYLg",
  authDomain: "como-estas-4655a.firebaseapp.com",
  projectId: "como-estas-4655a",
  storageBucket: "como-estas-4655a.appspot.com",
  messagingSenderId: "62590770243",
  appId: "1:62590770243:web:32fa93615b262cd551c8f6",
  measurementId: "G-WJ3KSDP65L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export default auth;