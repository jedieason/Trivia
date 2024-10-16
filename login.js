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
const signOutButton = document.getElementById("signOutButton");
const userButton = document.getElementById("userButton");
const userButtonHomepage = document.getElementById("userButton-homepage");
const userInfo = document.getElementById("userInfo");
// const userName = document.getElementById("userName");

document.addEventListener('DOMContentLoaded', (event) => {
    if (userButton) {
        userInfo.style.display = "none";
    } else {
        console.error("Element with ID 'userButton' not found.");
    }
});

const userSignIn = async () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      signInButton.style.display = "none";
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
    signInButton.style.display = "block";
    console.log("User signed out");
    
    // Reset the expandable frame
    const frames = document.querySelectorAll('.expandable-frame');
    frames.forEach(frame => {
      frame.classList.remove('expanded', 'till-button-expanded');
    });
    
    // Hide logout buttons
    const logoutButtons = document.querySelectorAll('.logout-button');
    logoutButtons.forEach(button => {
      button.classList.remove('show-logout');
    });
    
    // Reset user profile pictures
    userButton.src = '';
    userButtonHomepage.src = '';
  }).catch((error) => {
    console.error("Error signing out:", error);
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    signInButton.style.display = "none";
    userInfo.style.display = "block";
    userButton.src = user.photoURL;
    userButtonHomepage.src = user.photoURL;
    
    // Reset the expandable frame
    const frames = document.querySelectorAll('.expandable-frame');
    frames.forEach(frame => {
      frame.classList.remove('expanded', 'till-button-expanded');
    });
    
    // Hide logout buttons
    const logoutButtons = document.querySelectorAll('.logout-button');
    logoutButtons.forEach(button => {
      button.classList.remove('show-logout');
    });
  } else {
    userInfo.style.display = "none";
    signInButton.style.display = "block";
    userButton.src = '';
    userButtonHomepage.src = '';
  }
});

signInButton.addEventListener('click', userSignIn);
signOutButton.addEventListener('click', userSignOut);
