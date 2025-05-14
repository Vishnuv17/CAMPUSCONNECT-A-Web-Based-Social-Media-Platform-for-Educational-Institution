// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBm3Os4kCi8UfNeRCl46OtgXiY506f2wPU",
    authDomain: "campus-connect-cb955.firebaseapp.com",
    databaseURL: "https://campus-connect-cb955-default-rtdb.firebaseio.com",
    projectId: "campus-connect-cb955",
    storageBucket: "campus-connect-cb955.firebasestorage.app",
    messagingSenderId: "931888398108",
    appId: "1:931888398108:web:6f6cab7053dd3cd2cc04d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Realtime username and register number check
const usernameInput = document.getElementById("username");
const registerInput = document.getElementById("register_number");
const errorMsg = document.getElementById("errorMsg");

usernameInput.addEventListener("input", () => {
    const username = usernameInput.value.trim();
    if (username === "") {
        errorMsg.textContent = "";
        return;
    }

    const dbRef = ref(database);
    get(child(dbRef, "users")).then((snapshot) => {
        let exists = false;
        snapshot.forEach((userSnap) => {
            const data = userSnap.val();
            if (data.username === username) {
                exists = true;
            }
        });
        if(exists){
        errorMsg.textContent ="Username already taken!";
        document.querySelector(".usernameError i").style.display='block';
        }else{
            errorMsg.textContent ="";
        document.querySelector(".usernameError i").style.display='none';
        }
    });
});

registerInput.addEventListener("input", () => {
    const registerNumber = registerInput.value.trim();
    if (registerNumber === "") {
        errorMsg.textContent = "";
        return;
    }

    const dbRef = ref(database);
    get(child(dbRef, "users")).then((snapshot) => {
        let exists = false;
        snapshot.forEach((userSnap) => {
            const data = userSnap.val();
            if (data.register_number === registerNumber) {
                exists = true;
            }
        });
        if(exists){
            errorMsg.textContent ="Register number already used!";
            document.querySelector(".rnoError i").style.display='block';
            }else{
                errorMsg.textContent ="";
            document.querySelector(".rnoError i").style.display='none';
            }
    });
});




// Sign Up function
function signUp() {
    const name = document.getElementById("name").value;
    const registerNumber = document.getElementById("register_number").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const designation = document.getElementById("designation").value;
    const department = document.getElementById("department").value;
    const password = document.getElementById("password").value;

    if (name && registerNumber && username && email && phone && designation && department && password) {
        const dbRef = ref(database);
        get(child(dbRef, `users/`)).then((snapshot) => {
            let usernameExists = false;
            let registerNumberExists=false;

            snapshot.forEach((userSnapshot) => {
                const userData = userSnapshot.val();
                if (userData.username === username) {
                    usernameExists = true;
                }
                if (userData.register_number===registerNumber) {
                    registerNumberExists = true;
                }
            });

            if (usernameExists) {
                alert("Username already taken!");
            }
            else if(registerNumberExists){
                alert("Register Number already taken!");
            }
             else {
                const userRef = ref(database, `users/${registerNumber}`);
                set(userRef, {
                    name: name,
                    register_number: registerNumber,
                    username: username,
                    email: email,
                    phone: phone,
                    designation: designation,
                    department: department,
                    password: password
                })
                .then(() => {
                    alert("Registration successful!");
                    document.querySelector("form").reset();
                })
                .catch((error) => {
                    alert("Error: " + error.message);
                });
            }
        }).catch((error) => {
            alert("Error: " + error.message);
        });

    } else {
        alert("Please fill out all fields.");
    }
}



// Sign In function
function signIn() {
  const email = document.getElementById("signInEmail").value;
  const password = document.getElementById("signInPassword").value;

  if (email && password) {
      const dbRef = ref(database);
      get(child(dbRef, `users/`)).then((snapshot) => {
          if (snapshot.exists()) {
              let found = false;
              snapshot.forEach((userSnapshot) => {
                  const userData = userSnapshot.val();
                  if (userData.email === email && userData.password === password) {
                      found = true;
                      // நம்பகமான தகவலை உள்ளமைத்தல்
                      const registerNumber = userData.register_number;
                      // index.html பக்கத்திற்கு மாற்றம் (பதிவு எண்ணுடன்)
                      window.location.href = `index.html?reg=${registerNumber}`;
                  }
              });
              if (!found) {
                  alert("Invalid email or password.");
              }
          } else {
              alert("No users found.");
          }
      }).catch((error) => {
          alert("Error: " + error.message);
      });
  } else {
      alert("Please enter both email and password.");
  }
}



// Export the functions to the global scope
window.signUp = signUp;
window.signIn = signIn;
