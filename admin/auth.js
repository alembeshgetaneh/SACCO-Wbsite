// Authentication System for Admin Panel
class AdminAuth {
  constructor() {
    this.checkAuth();
  }

  // Check if user is authenticated
  checkAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const loginTime = localStorage.getItem('adminLoginTime');
    const currentTime = Date.now();
    
    // Check if login session is still valid (24 hours)
    const sessionValid = loginTime && (currentTime - parseInt(loginTime)) < (24 * 60 * 60 * 1000);
    
    if (!isLoggedIn || !sessionValid) {
      this.redirectToLogin();
    }
  }

  // Redirect to login page
  redirectToLogin() {
    window.location.href = '../member-login.html';
  }

  // Logout function
  logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    this.redirectToLogin();
  }

  // Get current admin credentials
  getCurrentCredentials() {
    return JSON.parse(localStorage.getItem('adminCredentials') || '{"username": "admin", "password": "admin123"}');
  }

  // Update admin credentials
  updateCredentials(newUsername, newPassword) {
    const credentials = {
      username: newUsername,
      password: newPassword
    };
    localStorage.setItem('adminCredentials', JSON.stringify(credentials));
  }

  // Create new user role
  createUserRole(role, username, password, email) {
    const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    const newRole = {
      id: Date.now(),
      role: role,
      username: username,
      password: password,
      email: email,
      created: new Date().toISOString()
    };
    roles.push(newRole);
    localStorage.setItem('userRoles', JSON.stringify(roles));
    return newRole;
  }

  // Get all user roles
  getUserRoles() {
    return JSON.parse(localStorage.getItem('userRoles') || '[]');
  }

  // Delete user role
  deleteUserRole(roleId) {
    const roles = this.getUserRoles();
    const filteredRoles = roles.filter(role => role.id !== roleId);
    localStorage.setItem('userRoles', JSON.stringify(filteredRoles));
  }
}

// Initialize authentication
const adminAuth = new AdminAuth();

// Add logout functionality to logout button
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      adminAuth.logout();
    });
  }
});

// Export for use in other files
window.adminAuth = adminAuth; 