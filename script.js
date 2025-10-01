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

// Sign-up
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

// Sign-in
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


// Log-out function
function logout() {
    auth.signOut()
        .then(() => {
            alert("You have been logged out successfully!");
            // Show the login page again
            document.querySelector('.login-page').style.display = 'block';
            document.querySelector('.navigation-page').style.display = 'none';
        })
        .catch((error) => {
            alert("Error logging out: " + error.message);
        });
}

// Expose to HTML so you can call it from a button
window.logout = logout;


// Placeholder navigation functions
function search() { alert("Search rentals coming soon!"); }
function view() { alert("View rentals coming soon!"); }
function addProperty() { alert("Add your property coming soon!"); }


// Expose to HTML
window.signin = signin;
window.signup = signup;
window.search = search;
window.view = view;
window.addProperty = addProperty;
window.help = help;


// Hide navigation initially
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.navigation-page').style.display = 'none';
});

////////////////////////////////////////////////Done with part 1///////////////////////////////////////////////////////////////////



//Now to part 2


function help() { 
            document.querySelector('.navigation-page').style.display = 'none';
            document.querySelector('.help-page').style.display = 'block';
        }


function back() {
          document.querySelector('.help-page').style.display = 'none';
          document.querySelector('.navigation-page').style.display = 'block';
        }
        
        
        
        
        
window.back = back;
