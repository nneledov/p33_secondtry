const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

// Middleware for parsing JSON
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public directory

// Ensure users.json file exists
if (!fs.existsSync(USERS_FILE)) {
    console.log("Creating users.json file...");
    fs.writeFileSync(USERS_FILE, JSON.stringify({}));
}

// Load users from the file
function loadUsers() {
    try {
        if (fs.existsSync(USERS_FILE)) {
            const data = fs.readFileSync(USERS_FILE, 'utf8');
            return data ? JSON.parse(data) : {};  // If file is empty, return an empty object
        }
    } catch (err) {
        console.error("Error loading users:", err);
    }
    return {};  // Return empty object on error
}

// Save users to the file
function saveUsers(users) {
    try {
        console.log("Saving users to users.json...");  // Debug log
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        console.log("Users saved successfully.");
    } catch (err) {
        console.error("Error saving users:", err);
    }
}

// Load users when the app starts
let users = loadUsers();
console.log("Initial users:", users);  // Log current users on startup

// Function to check password strength
function isStrongPassword(password) {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

// Route for login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Load the most recent users data from the file to ensure it's up to date
    users = loadUsers();

    // Check if the username and password match an existing user
    if (users.hasOwnProperty(username) && users[username].password === password) {
        return res.json({ message: 'Login successful! Redirecting to the dashboard...' });
    } else {
        // Respond with a 401 status code if login credentials are incorrect
        return res.status(401).json({ error: 'Incorrect username and/or password.' });
    }
});

// Route for creating an account
app.post('/create_account', (req, res) => {
    const { username, password, email } = req.body;

    console.log("Received data for account creation:", req.body);  // Log received data

    if (!username || !password || !email) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    if (username in users) {
        return res.status(400).json({ error: 'Username already exists. Please login or reset your password.' });
    }

    if (!isStrongPassword(password)) {
        return res.status(400).json({ error: 'Password is too weak. Use at least 8 characters with letters and numbers.' });
    }

    // Add the new user to the users object
    users[username] = { password, email };
    console.log("Updated users:", users);  // Log the updated users object

    // Save the users to the file
    saveUsers(users);

    return res.status(201).json({ message: 'Account created successfully!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
