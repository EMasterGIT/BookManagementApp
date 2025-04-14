const API_URL = 'http://localhost:5000/api';

// Define login function
const login = async (username, password) => {
  try {
    // Send POST request to /api/auth/login
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Send JSON data
      },
      body: JSON.stringify({ username, password }),
    });

    // Handle non-200 responses
    if (!response.ok) {
      throw new Error('Failed to log in');
    }

    // Parse JSON response
    const data = await response.json();

    // Store the token in localStorage
    localStorage.setItem('token', data.token);

    // Redirect to dashboard upon successful login
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Error during login:', error);
    alert('Login failed: ' + error.message);
  }
};

// Define register function as a top-level function (not inside login)
const register = async (username, password, role) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    });

    if (!response.ok) throw new Error('Failed to register');

    const data = await response.json();
    alert('Registration successful! Please log in.');
    // Optionally, redirect to the login page (index.html)
    window.location.href = '/';
  } catch (error) {
    console.error('Error during registration:', error);
    alert('Registration failed: ' + error.message);
  }
};

// Function to check if the user is authenticated
const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    // If on the login page and already logged in, redirect to dashboard.
    if (window.location.pathname === '/') {
      window.location.href = '/dashboard';
    }
  } else {
    // If no token and not on the login page, redirect to login (index.html)
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }
};

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Get form elements
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form'); // Registration form

  // Add submit event listener for login form
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      login(username, password);
    });
  }

  // Add submit event listener for register form
  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('register-username').value;
      const password = document.getElementById('register-password').value;
      const role = document.getElementById('role').value;
      register(username, password, role);
    });
  }

  // Check authentication status on page load
  checkAuth();

  // Logout functionality: get logout button and attach event listener
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = '/';
    });
  }
});
