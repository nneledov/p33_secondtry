document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const welcomePage = document.getElementById('welcomePage');
    const loginPage = document.getElementById('loginPage');
    const createAccountPage = document.getElementById('createAccountPage');

    // Show only the welcome page initially
    welcomePage.style.display = 'block';
    loginPage.style.display = 'none';
    createAccountPage.style.display = 'none';

    // Welcome -> Login
    document.getElementById('loginBtn').addEventListener('click', function () {
        welcomePage.style.display = 'none';
        loginPage.style.display = 'block';
    });

    // Login -> Create Account
    document.getElementById('createAccountBtn').addEventListener('click', function () {
        loginPage.style.display = 'none';
        createAccountPage.style.display = 'block';
    });

    // Create Account -> Back to Login
    document.getElementById('backToLoginBtn').addEventListener('click', function () {
        createAccountPage.style.display = 'none';
        loginPage.style.display = 'block';
    });

        // Handle account creation form submission
    document.getElementById('createAccountForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting normally
        const newUsername = document.getElementById('newUsername').value;
        const newPassword = document.getElementById('newPassword').value;
        const email = document.getElementById('email').value;

        fetch('/create_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: newUsername, password: newPassword, email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('error-message-creation').textContent = data.error;  // Display the error message
                document.getElementById('error-message-creation').style.display = 'block';
            } else {
                document.getElementById('success-message').textContent = data.message;  // Display the success message
                document.getElementById('success-message').style.display = 'block';
                setTimeout(() => {
                    // Redirect back to login page after showing success message
                    createAccountPage.style.display = 'none';
                    loginPage.style.display = 'block';
                }, 2000);
            }
        })
        .catch(error => {
            document.getElementById('error-message-creation').textContent = 'An error occurred. Please try again.';
            document.getElementById('error-message-creation').style.display = 'block';
        });
    });
});
