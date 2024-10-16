 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
 import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyB6NZTH5qHsJahgY7TLlBMjQQvdleYuY7w",
   authDomain: "auth-f79f5.firebaseapp.com",
   projectId: "auth-f79f5",
   storageBucket: "auth-f79f5.appspot.com",
   messagingSenderId: "543105084905",
   appId: "1:543105084905:web:09a98504001166b3e26f78"
 };

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider()

const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");
const topUpButton = document.getElementById("topUpButton");
const userButton = document.getElementById("userButton");
const message = document.getElementById("message");
const userName = document.getElementById("userName");

signOutButton.style.display = "none";
userButton.style.display = "none";

const userSignIn = async() => {
 signInWithPopup(auth, provider)
 .then((result) => {
     const user = result.user
     signInButton.style.display = "none";
     console.log(user);
 }).catch((error) => {
     const errorCode = error.code;
     const errorMessage = error.message
 })
}

const userSignOut = async() => {
 signOut(auth).then(() => {
     signOutButton.style.display = "none";
     userButton.style.display = "none";
     signInButton.style.display = "block";
     showModal("成功登出");
 }).catch((error) => {})
}

let userEmail = '';

onAuthStateChanged(auth, (user) => {
     if (user) {
         signInButton.style.display = "none"; // 添加這一行
         signOutButton.style.display = "block";
         userButton.style.display = "block";
         userName.innerHTML = user.displayName;
         userEmail = user.email;
     } else {
         signOutButton.style.display = "none";
     }
 });


signInButton.addEventListener('click', userSignIn);
signOutButton.addEventListener('click', userSignOut);
topUpButton.addEventListener('click', topUp);
