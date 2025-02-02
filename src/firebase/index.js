import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// alert('Add your firebase config!');
const firebaseConfig = {
    apiKey: "AIzaSyArFnJ4K6auYehvYPn8KWtxp4fToDxiHa8",
    authDomain: "javascript-2-7c197.firebaseapp.com",
    projectId: "javascript-2-7c197",
    storageBucket: "javascript-2-7c197.firebasestorage.app",
    messagingSenderId: "926475760597",
    appId: "1:926475760597:web:f5cffbeb212063f1fac35c"

};

let app, db, auth, authProvider;
try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    authProvider = new GoogleAuthProvider();
}catch(error){
    // do as set timeout because Quasar's Notify is not registered yet.
    setTimeout(() => Notification.error('Could not connect to database.', error), 1000);
}

export {db, auth, authProvider, firebaseConfig};