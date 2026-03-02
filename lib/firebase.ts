import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBOqO3KciuGxCS1L4ph4NHon5GgBjCpniQ",
    authDomain: "plant2trip-prod-5896a.firebaseapp.com",
    projectId: "plant2trip-prod-5896a",
    storageBucket: "plant2trip-prod-5896a.firebasestorage.app",
    messagingSenderId: "788938863378",
    appId: "1:788938863378:web:380c604fc6b2c21d47f9cb"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
