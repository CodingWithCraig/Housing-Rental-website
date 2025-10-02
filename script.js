// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set initial display
    document.querySelector('.login-page').style.display = 'block';
    document.querySelector('.navigation-page').style.display = 'none';
    document.querySelector('.rental-submissions').style.display = 'none';
    document.querySelector('.help-page').style.display = 'none';

    // Check if AWS SDK is loaded
    if (typeof AmazonCognitoIdentity === 'undefined') {
        console.error('AWS Cognito SDK not loaded!');
        alert('Authentication service is loading. Please refresh the page.');
        return;
    }

    // Cognito configuration - ONLY DECLARE ONCE
    const poolData = {
        UserPoolId: 'eu-north-1_q761gVZ4i',
        ClientId: '47e7h6lmcs682vgb14nf7mrkpf'
    };

    // Initialize User Pool
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    // ---------------- AUTH FUNCTIONS ----------------
    window.signup = function() {
    const email = document.querySelector('input[name="name"]').value;
    const password = document.querySelector('input[name="password"]').value;

    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    const attributeList = [];
    const emailAttribute = {
        Name: 'email',
        Value: email
    };
    
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(emailAttribute));

    // For App Client with Secret - calculate SECRET_HASH
    const secretHash = CryptoJS.HmacSHA256(email + "47e7h6lmcs682vgb14nf7mrkpf", "1spj7obrm3fv0k7f7t528u57ulh8li1li69babocktp69fsisnvp").toString(CryptoJS.enc.Base64);
    
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
};

    // ---------------- NAVIGATION FUNCTIONS ----------------
    window.search = function() { 
        alert("Search rentals coming soon!"); 
    };

    window.view = function() { 
        alert("View rentals coming soon!"); 
    };

    window.help = function() {
        document.querySelector('.login-page').style.display = 'none';
        document.querySelector('.navigation-page').style.display = 'none';
        document.querySelector('.rental-submissions').style.display = 'none';
        document.querySelector('.help-page').style.display = 'block';
    };

    window.addProperty = function() {
        document.querySelector('.login-page').style.display = 'none';
        document.querySelector('.navigation-page').style.display = 'none';
        document.querySelector('.help-page').style.display = 'none';
        document.querySelector('.rental-submissions').style.display = 'block';
    };

    window.back = function() {
        document.querySelector('.login-page').style.display = 'none';
        document.querySelector('.rental-submissions').style.display = 'none';
        document.querySelector('.help-page').style.display = 'none';
        document.querySelector('.navigation-page').style.display = 'block';
    };

    // ---------------- RENTAL FORM HANDLING ----------------
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
            window.back();
        });
    }

    console.log('All functions loaded successfully!');
});

