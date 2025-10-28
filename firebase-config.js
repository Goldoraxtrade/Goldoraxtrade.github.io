// ใส่ค่าตาม Firebase project ของคุณ
const firebaseConfig = {
  apiKey: "AIzaSyAaEnErGc5fCCAPv6x6hkIVK1BYVGpNY88",
  authDomain: "goldorax-80664.firebaseapp.com",
  projectId: "goldorax-80664",
  storageBucket: "goldorax-80664.appspot.com",
  messagingSenderId: "702976916189",
  appId: "1:702976916189:web:480f9e49db3ba032527934"
};

// Initialize Firebase (ต้อง import Firebase SDK ในแต่ละหน้า หรือใน main.js)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
