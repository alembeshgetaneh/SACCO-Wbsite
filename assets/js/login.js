document.addEventListener('DOMContentLoaded', () => {
  // Tab switching functionality
  const tabBtns = document.querySelectorAll('.tab-btn');
  const loginForms = document.querySelectorAll('.login-form');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      // Remove active class from all tabs and forms
      tabBtns.forEach(b => b.classList.remove('active'));
      loginForms.forEach(form => form.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding form
      btn.classList.add('active');
      document.getElementById(`${targetTab}-login`).classList.add('active');
    });
  });

  // Password visibility toggle
  const passwordToggles = document.querySelectorAll('.password-toggle');
  
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.previousElementSibling;
      const icon = toggle.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });

  // Member login form handling
  const memberForm = document.getElementById('member-form');
  const memberStatus = document.getElementById('login-status');

  memberForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const memberId = document.getElementById('member-id').value;
    const password = document.getElementById('member-password').value;
    
    // Show loading state
    const submitBtn = memberForm.querySelector('.login-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      // Mock authentication (replace with real API call)
      if (memberId && password) {
        showStatus('success', 'Login successful! Redirecting to member portal...');
        
        // Redirect to member portal (replace with actual URL)
        setTimeout(() => {
          window.location.href = 'member-portal.html';
        }, 2000);
      } else {
        showStatus('error', 'Invalid member ID or password. Please try again.');
      }
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });

  // Admin login form handling
  const adminForm = document.getElementById('admin-form');
  
  adminForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    // Show loading state
    const submitBtn = adminForm.querySelector('.login-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      // Get stored admin credentials
      const storedCredentials = JSON.parse(localStorage.getItem('adminCredentials') || '{"username": "admin", "password": "admin123"}');
      
      // Authenticate against stored credentials
      if (username === storedCredentials.username && password === storedCredentials.password) {
        showStatus('success', 'Admin login successful! Redirecting to admin dashboard...');
        
        // Store login session
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminLoginTime', Date.now().toString());
        
        // Redirect to admin dashboard
        setTimeout(() => {
          window.location.href = 'admin/index.html';
        }, 2000);
      } else {
        showStatus('error', 'Invalid username or password. Please try again.');
      }
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });

  // Status message display function
  function showStatus(type, message) {
    const statusDiv = document.getElementById('login-status');
    statusDiv.textContent = message;
    statusDiv.className = `login-status ${type}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 5000);
  }

  // Form validation
  const inputs = document.querySelectorAll('.login-form input[required]');
  
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
    
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });

  function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Validation rules
    if (!value) {
      showFieldError(field, `${getFieldLabel(fieldName)} is required`);
      return false;
    }
    
    if (fieldName === 'memberId' && value.length < 3) {
      showFieldError(field, 'Member ID must be at least 3 characters');
      return false;
    }
    
    if (fieldName === 'password' && value.length < 6) {
      showFieldError(field, 'Password must be at least 6 characters');
      return false;
    }
    
    if (fieldName === 'username' && value.length < 3) {
      showFieldError(field, 'Username must be at least 3 characters');
      return false;
    }
    
    return true;
  }

  function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
  }

  function getFieldLabel(fieldName) {
    const labels = {
      memberId: 'Member ID',
      password: 'Password',
      username: 'Username'
    };
    return labels[fieldName] || fieldName;
  }

  // Remember me functionality
  const rememberCheckboxes = document.querySelectorAll('input[name="remember"]');
  
  rememberCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        // Store login preference (in real app, use secure cookies)
        localStorage.setItem('rememberLogin', 'true');
      } else {
        localStorage.removeItem('rememberLogin');
      }
    });
  });

  // Check for remembered login preference
  if (localStorage.getItem('rememberLogin') === 'true') {
    rememberCheckboxes.forEach(checkbox => {
      checkbox.checked = true;
    });
  }

  // Keyboard navigation for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const activeForm = document.querySelector('.login-form.active');
      const submitBtn = activeForm?.querySelector('.login-btn');
      if (submitBtn && !submitBtn.disabled) {
        submitBtn.click();
      }
    }
  });

  // Focus management for accessibility
  const firstInput = document.querySelector('.login-form.active input');
  if (firstInput) {
    firstInput.focus();
  }
});

// Add CSS for field errors
const style = document.createElement('style');
style.textContent = `
  .login-form input.error {
    border-color: #dc3545;
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
  }
  
  .field-error {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
`;
document.head.appendChild(style); 