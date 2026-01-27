import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCXWsGIbhaXLZRxqfUPBkJVibHP5FONPl8",
    authDomain: "weding-d6f5a.firebaseapp.com",
    databaseURL: "https://weding-d6f5a-default-rtdb.firebaseio.com/",
    projectId: "weding-d6f5a",
    storageBucket: "weding-d6f5a.firebasestorage.app",
    messagingSenderId: "601571974682",
    appId: "1:601571974682:web:d65a2bf3ded17266eebba3",
    measurementId: "G-RKFGGBN4E5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// For debugging/seeding
if (typeof window !== 'undefined') {
    window.db = db;
}

export { app, analytics, db };
