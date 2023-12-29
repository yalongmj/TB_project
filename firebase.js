import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; 
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyB1s1TCp7Ty4NwL3pBmKbs-o2nqhT9gtd8",
    authDomain: "nursing-ca271.firebaseapp.com",
    projectId: "nursing-ca271",
    storageBucket: "nursing-ca271.appspot.com",
    messagingSenderId: "924908483260",
    appId: "1:924908483260:web:20c46752f3a8a9ce4516b9",
    measurementId: "G-D9K5MRYYGD"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const FIREBASE_APP = app;
export const FIREBASE_DB = getFirestore(app);
export const FIREBASE_AUTH = auth;
export const FIREBASE_STORAGE = getStorage(app);
