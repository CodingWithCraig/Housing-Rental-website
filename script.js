// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set initial display
    document.querySelector('.login-page').style.display = 'block';
    document.querySelector('.navigation-page').style.display = 'none';
    document.querySelector('.rental-submissions').style.display = 'none';
    document.querySelector('.help-page').style.display = 'none';

    // Check if AWS SDK is loaded
    if (typeof AmazonCognitoIdentity === 'undefined' || typeof AWS === 'undefined') {
        console.error('AWS SDK not loaded!');
        alert('AWS services are loading. Please refresh the page.');
        return;
    }

    // Configure AWS Region
    AWS.config.update({
        region: 'eu-north-1'
    });

    // Cognito configuration
    const poolData = {
        UserPoolId: 'eu-north-1_q761gVZ4i',
        ClientId: '5qcs3mm2vagjo9n3smd7lctnf2'
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

    window.signin = function() {
        const email = document.querySelector('input[name="name"]').value;
        const password = document.querySelector('input[name="password"]').value;

        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }

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
                // Configure AWS credentials with Identity Pool after login
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'eu-north-1:29d12fad-e214-4b32-9aba-a0b7562aeb4a',
                    Logins: {
                        'cognito-idp.eu-north-1.amazonaws.com/eu-north-1_q761gVZ4i': result.getIdToken().getJwtToken()
                    }
                });

                // Refresh credentials to apply the permissions
                AWS.config.credentials.refresh((error) => {
                    if (error) {
                        console.error('Error refreshing credentials:', error);
                        alert('Login successful but AWS permissions need configuration');
                    } else {
                        console.log('AWS credentials refreshed with permissions');
                    }
                    
                    alert("Login successful ✅");
                    document.querySelector('.login-page').style.display = 'none';
                    document.querySelector('.navigation-page').style.display = 'block';
                });
            },
            onFailure: function(err) {
                alert("Error: " + (err.message || JSON.stringify(err)));
            }
        });
    };

    window.logout = function() {
        const currentUser = userPool.getCurrentUser();
        if (currentUser) {
            currentUser.signOut();
            if (AWS.config.credentials) {
                AWS.config.credentials.clearCachedId();
            }
        }
        alert("You have been logged out ✅");
        document.querySelector('.login-page').style.display = 'block';
        document.querySelector('.navigation-page').style.display = 'none';
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

    // ---------------- STORAGE FUNCTIONS ----------------
    async function uploadImageToS3(imageFile, propertyId) {
        // Wait for credentials to be ready
        if (!AWS.config.credentials) {
            throw new Error('AWS credentials not configured. Please login first.');
        }

        const s3 = new AWS.S3();
        const fileName = `properties/${propertyId}/${Date.now()}-${imageFile.name}`;
        
        const params = {
            Bucket: 'rental-properties-images-craig', // Your S3 bucket name
            Key: fileName,
            Body: imageFile,
            ContentType: imageFile.type,
            ACL: 'public-read' // Makes images publicly viewable
        };
        
        try {
            const result = await s3.upload(params).promise();
            console.log('Image uploaded successfully:', result.Location);
            return result.Location; // Returns the URL of uploaded image
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload image: ' + error.message);
        }
    }

    async function savePropertyToDynamoDB(propertyData) {
        // Wait for credentials to be ready
        if (!AWS.config.credentials) {
            throw new Error('AWS credentials not configured. Please login first.');
        }

        const dynamodb = new AWS.DynamoDB.DocumentClient();
        
        const params = {
            TableName: 'RentalProperties',
            Item: propertyData
        };
        
        try {
            await dynamodb.put(params).promise();
            console.log('Property saved to DynamoDB:', propertyData.propertyId);
            return true;
        } catch (error) {
            console.error('Error saving to DynamoDB:', error);
            throw new Error('Failed to save property data: ' + error.message);
        }
    }

    // ---------------- RENTAL FORM HANDLING ----------------
    const rentalForm = document.getElementById('rentalForm');
    if (rentalForm) {
        rentalForm.addEventListener('submit', async function(e) {
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

            // Show loading state
            const submitButton = rentalForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Uploading...';
            submitButton.disabled = true;

            try {
                // Get current user
                const currentUser = userPool.getCurrentUser();
                if (!currentUser) {
                    throw new Error('Please login before submitting a property');
                }

                // Check if AWS credentials are ready
                if (!AWS.config.credentials) {
                    throw new Error('AWS permissions not ready. Please try again in a moment.');
                }

                // Generate unique property ID
                const propertyId = 'prop-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
                
                // Upload images to S3
                const imageUrls = [];
                for (let i = 0; i < images.length; i++) {
                    console.log(`Uploading image ${i + 1}/${images.length}`);
                    const imageUrl = await uploadImageToS3(images[i], propertyId);
                    imageUrls.push(imageUrl);
                }

                // Get user email
                const userEmail = await new Promise((resolve, reject) => {
                    currentUser.getSession(function(err, session) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(currentUser.getUsername());
                        }
                    });
                });

                // Prepare property data
                const propertyData = {
                    propertyId: propertyId,
                    location: location,
                    price: parseInt(price),
                    description: description,
                    imageUrls: imageUrls,
                    ownerEmail: userEmail,
                    createdAt: new Date().toISOString(),
                    status: 'pending'
                };

                // Save to DynamoDB
                await savePropertyToDynamoDB(propertyData);

                alert('Property submitted successfully! ✅\nImages uploaded: ' + imageUrls.length + '\nProperty ID: ' + propertyId);
                console.log('Property saved to AWS:', propertyData);
                
                // Reset form
                rentalForm.reset();
                
                // Go back to navigation
                window.back();

            } catch (error) {
                console.error('Submission error:', error);
                alert('Error submitting property: ' + error.message);
            } finally {
                // Reset button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }

    console.log('All functions loaded successfully!');
});
