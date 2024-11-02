// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
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
const provider = new GoogleAuthProvider();

const signInButton = document.getElementById("signInButton");
const HomepagesignInButton = document.getElementById("Homepage-signInButton");
const signOutButton = document.getElementById("signOutButton");
const userButton = document.getElementById("userButton");
const userButtonHomepage = document.getElementById("userButton-homepage");
const userInfo = document.getElementById("userInfo");
const HomepageuserInfo = document.getElementById("Homepage-userInfo");
// const userName = document.getElementById("userName");

document.addEventListener('DOMContentLoaded', (event) => {
    if (userButton) {
        userInfo.style.display = "none";
        HomepageuserInfo.style.display = "none";
    } else {
        console.error("Element with ID 'userButton' not found.");
    }
});

const userSignIn = async () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      signInButton.style.display = "none";
      HomepagesignInButton.style.display = "none";
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error ${errorCode}: ${errorMessage}`);
    });
};


const userSignOut = async() => {
  signOut(auth).then(() => {
      userInfo.style.display = "none";
      HomepageuserInfo.style.display = "none";
      signInButton.style.display = "block";
      HomepagesignInButton.style.display = "block";
      console.log("User signed out");
  }).catch((error) => {})
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    signInButton.style.display = "none";
    HomepagesignInButton.style.display = "none";
    userInfo.style.display = "block";
    HomepageuserInfo.style.display = "block";
    userButton.src = user.photoURL; // Set the user's profile picture
    userButtonHomepage.src = user.photoURL; // Set the user's profile picture
//    userName.innerHTML = user.displayName;
  } else {
    userInfo.style.display = "none";
    HomepageuserInfo.style.display = "none";
    HomepagesignInButton.style.display = "block";
    signInButton.style.display = "block";
  }
});

signInButton.addEventListener('click', userSignIn);
HomepagesignInButton.addEventListener('click', userSignIn);
signOutButton.addEventListener('click', userSignOut);
