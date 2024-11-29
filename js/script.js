// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const welcomeScreen = document.getElementById('welcomeScreen');
const loginFormElement = document.getElementById('loginFormElement');
const signupFormElement = document.getElementById('signupFormElement');
const showSignupLink = document.getElementById('showSignup');
const showLoginLink = document.getElementById('showLogin');
const logoutButton = document.getElementById('logoutButton');
const alertPopup = document.getElementById('validationAlert');
const alertMessage = document.getElementById('alertMessage');
const closeAlertButton = document.getElementById('closeAlert');

// Utility Functions
function showError(message) {
    alertMessage.textContent = message;
    alertPopup.classList.remove('d-none');
    alertPopup.classList.add('show');
    
    // Auto-hide after 3 seconds
    setTimeout(hideError, 3000);
}

function hideError() {
    alertPopup.classList.remove('show');
    alertPopup.classList.add('d-none');
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input');
    let isValid = true;

    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        if (!input.checkValidity()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    }

    return isValid;
}

function resetForm(form) {
    const inputs = form.querySelectorAll('input');
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        input.classList.remove('is-invalid');
    }
    form.reset();
}

function toggleForms() {
    loginForm.classList.toggle('d-none');
    signupForm.classList.toggle('d-none');
    hideError();
}

function showWelcomeScreen(username) {
    loginForm.classList.add('d-none');
    signupForm.classList.add('d-none');
    welcomeScreen.classList.remove('d-none');
    
    const avatarText = document.querySelector('.avatar-text');
    const welcomeText = document.querySelector('.welcome-text');
    
    avatarText.textContent = username.charAt(0).toUpperCase();
    welcomeText.textContent = `Welcome back, ${username}!`;
}

// Local Storage Functions
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

// Auth Functions
function signup(username, email, password) {
    const users = getUsers();
    
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            throw new Error('Email already exists');
        }
    }
    
    const newUser = { username, email, password };
    saveUser(newUser);
    return newUser;
}

function login(email, password) {
    const users = getUsers();
    let foundUser = null;
    
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password === password) {
            foundUser = users[i];
            break;
        }
    }
    
    if (!foundUser) {
        throw new Error('Invalid email or password');
    }
    
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    return foundUser;
}

function logout() {
    localStorage.removeItem('currentUser');
    welcomeScreen.classList.add('d-none');
    loginForm.classList.remove('d-none');
}

// Event Listeners
loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (validateForm(loginFormElement)) {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const user = login(email, password);
            resetForm(loginFormElement);
            showWelcomeScreen(user.username);
        } catch (error) {
            showError(error.message);
        }
    }
});

signupFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (validateForm(signupFormElement)) {
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        try {
            signup(username, email, password);
            resetForm(signupFormElement);
            toggleForms();
            showError('Account created successfully! Please login.');
        } catch (error) {
            showError(error.message);
        }
    }
});

showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleForms();
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    toggleForms();
});

logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
});

closeAlertButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    hideError();
});

// Check for logged-in user on page load
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
        showWelcomeScreen(currentUser.username);
    }
});