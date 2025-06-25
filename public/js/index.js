import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDL9f1N3EWEXbIx0hfUrZ1IBufbjrlFM40",
  authDomain: "marmita-509ae.firebaseapp.com",
  databaseURL: "https://marmita-509ae-default-rtdb.firebaseio.com/",
  projectId: "marmita-509ae",
  storageBucket: "marmita-509ae.firebasestorage.app",
  messagingSenderId: "949522360367",
  appId: "1:949522360367:web:35d5fbb88d723ae373feda",
  measurementId: "G-TRLT5MGKG4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { auth, db, storage, signInWithEmailAndPassword };
