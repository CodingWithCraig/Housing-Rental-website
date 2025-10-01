// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDTbMmaFgnsUdIq0YpaO8n3z5ug7n-ZMCo",
  authDomain: "rental-paradise-5853e.firebaseapp.com",
  projectId: "rental-paradise-5853e",
  storageBucket: "rental-paradise-5853e.appspot.com",
  messagingSenderId: "358178838473",
  appId: "1:358178838473:web:c5eb5fc721ce541e71ba18",
  measurementId: "G-8YKE8BPZHB"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ---------------- AUTHENTICATION ----------------
function signup() {
    const email = document.querySelector('input[name="name"]').value;
    const password = document.querySelector('input[name="password"]').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            alert("Sign-up successful: " + userCredential.user.email);
            document.querySelector('.login-page').style.display = 'none';
            document.querySelector('.navigation-page').style.display = 'block';
        })
        .catch(error => alert("Error: " + error.message));
}

function signin() {
    const email = document.querySelector('input[name="name"]').value;
    const password = document.querySelector('input[name="password"]').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            alert("Login successful: " + userCredential.user.email);
            document.querySelector('.login-page').style.display = 'none';
            document.querySelector('.navigation-page').style.display = 'block';
        })
        .catch(error => alert("Error: " + error.message));
}

function logout() {
    auth.signOut()
        .then(() => {
            alert("You have been logged out successfully!");
            document.querySelector('.login-page').style.display = 'block';
            document.querySelector('.navigation-page').style.display = 'none';
        })
        .catch((error) => alert("Error logging out: " + error.message));
}

window.signup = signup;
window.signin = signin;
window.logout = logout;

// ---------------- NAVIGATION ----------------
function search() { alert("Search rentals coming soon!"); }
function view() { alert("View rentals coming soon!"); }

function help() { 
    document.querySelector('.navigation-page').style.display = 'none';
    document.querySelector('.help-page').style.display = 'block';
}

function addProperty() {
    document.querySelector('.navigation-page').style.display = 'none';
    document.querySelector('.rental-submissions').style.display = 'block';
}

function backToNavigation() {
    document.querySelector('.rental-submissions').style.display = 'none';
    document.querySelector('.help-page').style.display = 'none';
    document.querySelector('.navigation-page').style.display = 'block';
}

window.search = search;
window.view = view;
window.help = help;
window.addProperty = addProperty;
window.back = backToNavigation;

// ---------------- INITIAL VISIBILITY ----------------
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.navigation-page').style.display = 'none';
    document.querySelector('.rental-submissions').style.display = 'none';
    document.querySelector('.help-page').style.display = 'none';
});

// ---------------- RENTAL FORM UPLOAD ----------------
const form = document.getElementById("rentalForm");
const statusEl = document.getElementById("status");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = firebase.auth().currentUser;

    if (!user) {
      alert("You must be logged in to submit a listing!");
      return;
    }

    const location = document.getElementById("location").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const files = document.getElementById("images").files;

    if (files.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    try {
      statusEl.innerText = "Uploading images...";
      const imageUrls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = storage.ref(`users/${user.uid}/${Date.now()}_${file.name}`);
        await storageRef.put(file);
        const url = await storageRef.getDownloadURL();
        imageUrls.push(url);
      }

      await db.collection("listings").add({
  userId: user.uid,
  location,
  price,
  description,
  images: imageUrls,
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
});


      statusEl.innerText = "Listing uploaded successfully ✅";
      form.reset();

    } catch (error) {
      console.error("Error uploading listing:", error);
      statusEl.innerText = "Error uploading listing ❌: " + error.message;
    }
  });
}
