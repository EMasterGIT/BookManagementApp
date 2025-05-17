//utils/auth.js
export function getToken() {
    return localStorage.getItem('token');
  }
  
  export function getUserRole() {
    const token = getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  }
  