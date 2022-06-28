import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCa99_8ZTPViVJrm53OIJVYbYmmrT1Sgqo",
    authDomain: "u-22-2022.firebaseapp.com",
    projectId: "u-22-2022",
    storageBucket: "u-22-2022.appspot.com",
    messagingSenderId: "651422756090",
    appId: "1:651422756090:web:ddbe708188408e3b43ed43"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
