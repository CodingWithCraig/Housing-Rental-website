// ---------------- AWS CONFIG ----------------
// Fix: Region should match your Identity Pool region
AWS.config.region = 'eu-north-1'; // Changed from us-east-1 to eu-north-1
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'eu-north-1:29d12fad-e214-4b32-9aba-a0b7562aeb4a'
});

// Setup Cognito User Pool
const poolData = {
  UserPoolId: "eu-north-1_q761gVZ4i",
  ClientId: "47e7h6lmcs682vgb14nf7mrkpf"
};

// Fix: Use the correct way to create UserPool
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// ---------------- AUTH FUNCTIONS ----------------
function signup() {
  const email = document.querySelector('input[name="name"]').value;
  const password = document.querySelector('input[name="password"]').value;

  // Fix: Create attribute list correctly
  const attributeList = [];
  const emailAttribute = {
    Name: 'email',
    Value: email
  };
  
  attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(emailAttribute));

  userPool.signUp(email, password, attributeList, null, function(err, result) {
    if (err) {
      console.error(err);
      alert("Error: " + (err.message || JSON.stringify(err)));
      return;
    }
    const cognitoUser = result.user;
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
    onSuccess: function(result) {
      alert("Login successful ✅");
      document.querySelector('.login-page').style.display = 'none';
      document.querySelector('.navigation-page').style.display = 'block';
    },
    onFailure: function(err) {
      alert("Error: " + (err.message || JSON.stringify(err)));
    }
  });
}

function logout() {
  const currentUser = userPool.getCurrentUser();
  if (currentUser) {
    currentUser.signOut();
    // Fix: Also clear AWS credentials
    AWS.config.credentials.clearCachedId();
  }
  alert("You have been logged out ✅");
  document.querySelector('.login-page').style.display = 'block';
  document.querySelector('.navigation-page').style.display = 'none';
}

// ---------------- NAVIGATION ----------------
function search() { 
  alert("Search rentals coming soon!"); 
}

function view() { 
  alert("View rentals coming soon!"); 
}

function help() {
  document.querySelector('.login-page').style.display = 'none';
  document.querySelector('.navigation-page').style.display = 'none';
  document.querySelector('.rental-submissions').style.display = 'none';
  document.querySelector('.help-page').style.display = 'block';
}

function addProperty() {
  document.querySelector('.login-page').style.display = 'none';
  document.querySelector('.navigation-page').style.display = 'none';
  document.querySelector('.help-page').style.display = 'none';
  document.querySelector('.rental-submissions').style.display = 'block';
}

function backToNavigation() {
  document.querySelector('.login-page').style.display = 'none';
  document.querySelector('.rental-submissions').style.display = 'none';
  document.querySelector('.help-page').style.display = 'none';
  document.querySelector('.navigation-page').style.display = 'block';
}

// Make functions global
window.signup = signup;
window.signin = signin;
window.logout = logout;
window.search = search;
window.view = view;
window.help = help;
window.addProperty = addProperty;
window.back = backToNavigation;

// ---------------- INITIAL VISIBILITY & FORM HANDLING ----------------
document.addEventListener('DOMContentLoaded', function() {
  // Set initial display
  document.querySelector('.login-page').style.display = 'block';
  document.querySelector('.navigation-page').style.display = 'none';
  document.querySelector('.rental-submissions').style.display = 'none';
  document.querySelector('.help-page').style.display = 'none';

  // Handle rental form submission
  const rentalForm = document.getElementById('rentalForm');
  if (rentalForm) {
    rentalForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const location = document.getElementById('location').value;
      const price = document.getElementById('price').value;
      const description = document.getElementById('description').value;
      const images = document.getElementById('images').files;
      
      // Basic validation
      if (!location || !price || !description || images.length === 0) {
        alert('Please fill in all fields');
        return;
      }
      
      // Here you would typically send this data to your backend
      alert('Property submitted successfully! Our team will review it.');
      
      // Reset form
      rentalForm.reset();
      
      // Go back to navigation
      backToNavigation();
    });
  }
});
