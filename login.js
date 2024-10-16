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
  }).catch((error) => {})
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    signInButton.style.display = "none";
    userInfo.style.display = "block";
    userButton.src = user.photoURL; // Set the user's profile picture
    userButtonHomepage.src = user.photoURL; // Set the user's profile picture
//    userName.innerHTML = user.displayName;
  } else {
    userInfo.style.display = "none";
    signInButton.style.display = "block";
  }
});

signInButton.addEventListener('click', userSignIn);
signOutButton.addEventListener('click', userSignOut);

sendDebugBtn.onclick = function() {
  var question = document.getElementById('debugQuestion').value;
  var answer = document.getElementById('debugAnswer').value;
  var explanation = document.getElementById('debugExplanation').value;

  // 收集选项数据
  var options = {};
  for (let key in currentQuestion.options) {
    var optionValue = document.getElementById(`debugOption_${key}`).value;
    options[key] = optionValue;
  }

  // 构建要发送的数据对象
  const data = {
    reporter: currentUserEmail,
    filename: currentJsonFile,
    question: question,
    answer: answer,
    explanation: explanation,
    options: JSON.stringify(options) // 将选项对象转换为字符串
  };

  // 将数据对象转换为查询参数字符串
  const queryParams = new URLSearchParams(data).toString();

  // 发送 GET 请求到 Apps Script
  fetch(`AKfycbyjf1DgMLA8UsTdd9ef-s5AzgzG9dqnNF-v8n9F7DmtTso2CnYrjw8mIO1dIcheq3cj?${queryParams}`, {
    method: 'GET',
    mode: 'no-cors'
  }).then(function() {
    console.log('Data sent to Google Sheets');
    // 关闭模态窗口或进行其他操作
    debugModal.style.display = 'none';
    alert('Data sent successfully!');
  }).catch(function(error) {
    console.error('Error:', error);
    alert('Failed to send data.');
  });
}
