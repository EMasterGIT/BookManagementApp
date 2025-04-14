const API_URL = 'http://localhost:5000/api';

// Sisselogimise funktsioon
const login = async (username, password) => {
  try {
    // Saada POST-päring aadressile /api/auth/login
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Saada JSON-andmed
      },
      body: JSON.stringify({ username, password }),
    });

    // Töötle mitte-200 vastuseid
    if (!response.ok) {
      throw new Error('Sisselogimine ebaõnnestus');
    }

    // Parsige JSON-vastus
    const data = await response.json();

    // Salvesta token localStorage'i
    localStorage.setItem('token', data.token);

    // Suuna edukal sisselogimisel juhtpaneelile
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Viga sisselogimisel:', error);
    alert('Sisselogimine ebaõnnestus: ' + error.message);
  }
};

// Registreerimise funktsioon
const register = async (username, password, role) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    });

    if (!response.ok) throw new Error('Registreerimine ebaõnnestus');

    const data = await response.json();
    alert('Registreerimine õnnestus! Palun logi sisse.');
    
    window.location.href = '/';
  } catch (error) {
    console.error('Viga registreerimisel:', error);
    alert('Registreerimine ebaõnnestus: ' + error.message);
  }
};

// Funktsioon, et kontrollida, kas kasutaja on autentitud
const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    // Kui ollakse sisselogimislehel ja juba sisse logitud, suuna juhtpaneelile.
    if (window.location.pathname === '/') {
      window.location.href = '/dashboard';
    }
  } else {
    // Kui token puudub ja ei olda sisselogimislehel, suuna sisselogimislehele (index.html)
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }
};

// Oota, kuni DOM on laaditud
document.addEventListener('DOMContentLoaded', () => {
  // Hangi vormi elemendid
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form'); // Registreerimisvorm

  // Lisa sisselogimisvormile submit-sündmuse kuulaja
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      login(username, password);
    });
  }

  // Lisa registreerimisvormile submit-sündmuse kuulaja
  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('register-username').value;
      const password = document.getElementById('register-password').value;
      const role = document.getElementById('role').value;
      register(username, password, role);
    });
  }

  // Kontrolli autentimise staatust lehe laadimisel
  checkAuth();

  // Logout-funktsionaalsus: hangi logout-nupp ja lisa sündmuse kuulaja
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = '/';
    });
  }
});