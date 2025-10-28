// ใส่ค่าตาม Firebase project ของคุณ
const firebaseConfig = {
apiKey: "AIzaSyAaEnErGc5fCCAPv6x6hkIVK1BYVGpNY88",
authDomain: "goldorax-80664.firebaseapp.com",
projectId: "goldorax-80664",
storageBucket: "goldorax-80664.firebasestorage.app",
messagingSenderId: "702976916189",
appId: "1:702976916189:web:480f9e49db3ba032527934"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);