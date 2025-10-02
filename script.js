// ---------------- AWS CONFIG ----------------
AWS.config.region = 'us-east-1'; // change to your region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'eu-north-1:29d12fad-e214-4b32-9aba-a0b7562aeb4a' // replace with your Cognito Identity Pool
});

// Setup Cognito User Pool (replace values with your own)
const poolData = {
  UserPoolId: "eu-north-1_q761gVZ4i", // Your user pool id here
  ClientId: "47e7h6lmcs682vgb14nf7mrkpf" // Your client id here
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// ---------------- AUTH FUNCTIONS ----------------
function signup() {
  const email = document.querySelector('input[name="name"]').value;
  const password = document.querySelector('input[name="password"]').value;

  const attributeList = [
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: "email",
      Value: email
    })
  ];

  userPool.signUp(email, password, attributeList, null, (err, result) => {
    if (err) {
      alert("Error: " + err.message || JSON.stringify(err));
      return;
    }
    alert("Sign-up successful, check your email for verification ✅");
    document.querySelector('.login-page').style.display = 'none';
    document.querySelector('.navigation-page').style.display = 'block';
  });
}

function signin() {
  const email = document.querySelector('input[name="name"]').value;
  const password = document.querySelector('input[name="password"]').value;

  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: email,
    Password: password
  });

  const userData = {
    Username: email,
    Pool: userPool
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      alert("Login successful ✅");
      document.querySelector('.login-page').style.display = 'none';
      document.querySelector('.navigation-page').style.display = 'block';
    },
    onFailure: (err) => {
      alert("Error: " + err.message || JSON.stringify(err));
    }
  });
}

function logout() {
  const currentUser = userPool.getCurrentUser();
  if (currentUser) {
    currentUser.signOut();
    alert("You have been logged out ✅");
    document.querySelector('.login-page').style.display = 'block';
    document.querySelector('.navigation-page').style.display = 'none';
  }
}

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

window.signup = signup;
window.signin = signin;
window.logout = logout;
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
