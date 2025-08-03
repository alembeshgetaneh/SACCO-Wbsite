document.addEventListener('DOMContentLoaded', () => {
  // Navigation functionality
  const navLinks = document.querySelectorAll('.admin-nav a');
  const sections = document.querySelectorAll('.admin-section');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = link.getAttribute('data-section');
      
      // Remove active class from all nav items and sections
      navLinks.forEach(l => l.parentElement.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      
      // Add active class to clicked nav item and target section
      link.parentElement.classList.add('active');
      document.getElementById(targetSection).classList.add('active');
    });
  });

  // Quick action buttons
  const actionButtons = document.querySelectorAll('.action-btn');
  actionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.target.textContent.trim();
      console.log(`Action clicked: ${action}`);
      
      // Handle different actions
      switch(action) {
        case 'Add News':
          showSection('news');
          break;
        case 'Add FAQ':
          showSection('faqs');
          break;
        case 'Upload File':
          showSection('downloads');
          break;
        case 'Add Team Member':
          showSection('team');
          break;
        case 'Send Newsletter':
          alert('Newsletter feature coming soon!');
          break;
      }
    });
  });

  // Section switching function
  window.showSection = (sectionId) => {
    // Remove active class from all nav items and sections
    navLinks.forEach(l => l.parentElement.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    
    // Add active class to target nav item and section
    const targetNavLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (targetNavLink) {
      targetNavLink.parentElement.classList.add('active');
    }
    document.getElementById(sectionId).classList.add('active');
  };

  // Modal functionality
  window.openNewsModal = () => {
    const modal = document.getElementById('newsModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Set default date to today
    const dateInput = modal.querySelector('input[name="publishDate"]');
    dateInput.value = new Date().toISOString().split('T')[0];
  };

  window.openFAQModal = () => {
    const modal = document.getElementById('faqModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  window.openDownloadModal = () => {
    const modal = document.getElementById('downloadModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  // Close modal functions
  window.closeNewsModal = () => {
    const modal = document.getElementById('newsModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    document.getElementById('newsForm').reset();
  };

  window.closeFAQModal = () => {
    const modal = document.getElementById('faqModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    document.getElementById('faqForm').reset();
  };

  window.closeDownloadModal = () => {
    const modal = document.getElementById('downloadModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    document.getElementById('downloadForm').reset();
  };

  // Close modal when clicking outside
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('show');
      document.body.style.overflow = 'auto';
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.modal.show');
      modals.forEach(modal => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
      });
    }
  });

         // Form submissions
       const forms = document.querySelectorAll('form');
       forms.forEach(form => {
         form.addEventListener('submit', (e) => {
           e.preventDefault();
           const formData = new FormData(form);
           const formType = form.id;
           
           console.log(`Form submitted: ${formType}`);
           console.log('Form data:', Object.fromEntries(formData));
           
           // Handle different form types
           switch(formType) {
             case 'newsForm':
               handleNewsSubmission(formData);
               break;
             case 'faqForm':
               handleFAQSubmission(formData);
               break;
             case 'downloadForm':
               handleDownloadSubmission(formData);
               break;
             case 'adminAccountForm':
               handleAdminAccountSubmission(formData);
               break;
             case 'securityForm':
               handleSecuritySubmission(formData);
               break;
             default:
               // Other settings forms
               showNotification('Settings saved successfully!', 'success');
           }
         });
       });

  // Handle news form submission
  function handleNewsSubmission(formData) {
    const newsData = {
      title: formData.get('title'),
      category: formData.get('category'),
      content: formData.get('content'),
      publishDate: formData.get('publishDate'),
      status: 'Published'
    };
    
    // Add to news table
    addNewsToTable(newsData);
    
    // Close modal and show success message
    closeNewsModal();
    showNotification('News article published successfully!', 'success');
  }

  // Handle FAQ form submission
  function handleFAQSubmission(formData) {
    const faqData = {
      question: formData.get('question'),
      category: formData.get('category'),
      answer: formData.get('answer')
    };
    
    // Add to FAQ table
    addFAQToTable(faqData);
    
    // Close modal and show success message
    closeFAQModal();
    showNotification('FAQ added successfully!', 'success');
  }

  // Handle download form submission
  function handleDownloadSubmission(formData) {
    const file = formData.get('file');
    const downloadData = {
      fileName: formData.get('displayName'),
      category: formData.get('category'),
      description: formData.get('description'),
      size: formatFileSize(file.size),
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    // Add to downloads table
    addDownloadToTable(downloadData);
    
    // Close modal and show success message
    closeDownloadModal();
    showNotification('File uploaded successfully!', 'success');
  }

  // Helper function to format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Add news to table
  function addNewsToTable(newsData) {
    const tbody = document.getElementById('news-table-body');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${newsData.title}</td>
      <td>${newsData.category}</td>
      <td>${newsData.publishDate}</td>
      <td><span class="status ${newsData.status.toLowerCase()}">${newsData.status}</span></td>
      <td>
        <button class="btn-small">Edit</button>
        <button class="btn-small btn-danger">Delete</button>
      </td>
    `;
    tbody.insertBefore(row, tbody.firstChild);
  }

  // Add FAQ to table
  function addFAQToTable(faqData) {
    const tbody = document.getElementById('faqs-table-body');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${faqData.question}</td>
      <td>${faqData.category}</td>
      <td>
        <button class="btn-small">Edit</button>
        <button class="btn-small btn-danger">Delete</button>
      </td>
    `;
    tbody.insertBefore(row, tbody.firstChild);
  }

         // Add download to table
       function addDownloadToTable(downloadData) {
         const tbody = document.getElementById('downloads-table-body');
         const row = document.createElement('tr');
         row.innerHTML = `
           <td>${downloadData.fileName}</td>
           <td>${downloadData.category}</td>
           <td>${downloadData.size}</td>
           <td>${downloadData.uploadDate}</td>
           <td>
             <button class="btn-small">Edit</button>
             <button class="btn-small btn-danger">Delete</button>
           </td>
         `;
         tbody.insertBefore(row, tbody.firstChild);
       }

       // Handle admin account form submission
       function handleAdminAccountSubmission(formData) {
         const currentPassword = formData.get('currentPassword');
         const newUsername = formData.get('newUsername');
         const newPassword = formData.get('newPassword');
         const confirmPassword = formData.get('confirmPassword');
         
         // Validate current password (mock validation)
         if (currentPassword !== 'admin123') {
           showNotification('Current password is incorrect!', 'error');
           return;
         }
         
         // Validate new password if provided
         if (newPassword) {
           if (newPassword.length < 6) {
             showNotification('New password must be at least 6 characters long!', 'error');
             return;
           }
           
           if (newPassword !== confirmPassword) {
             showNotification('New passwords do not match!', 'error');
             return;
           }
         }
         
         // Validate new username if provided
         if (newUsername) {
           if (newUsername.length < 3) {
             showNotification('Username must be at least 3 characters long!', 'error');
             return;
           }
           
           // Check if username contains only alphanumeric characters
           if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
             showNotification('Username can only contain letters, numbers, and underscores!', 'error');
             return;
           }
         }
         
                 // Update stored credentials
        const currentCredentials = JSON.parse(localStorage.getItem('adminCredentials') || '{"username": "admin", "password": "admin123"}');
        
        // Verify current password
        if (currentPassword !== currentCredentials.password) {
          showNotification('Current password is incorrect!', 'error');
          return;
        }
        
        // Update credentials
        if (newUsername) {
          currentCredentials.username = newUsername;
        }
        if (newPassword) {
          currentCredentials.password = newPassword;
        }
        
        // Save updated credentials
        localStorage.setItem('adminCredentials', JSON.stringify(currentCredentials));
        
        // Success message
        let updateMessage = 'Account updated successfully!';
        if (newUsername) {
          updateMessage += ` Username changed to: ${newUsername}`;
          // Update the readonly field
          document.querySelector('input[value="admin"]').value = newUsername;
        }
        if (newPassword) {
          updateMessage += ' Password changed successfully!';
        }
        
        showNotification(updateMessage, 'success');
        
        // Reset form
        document.getElementById('adminAccountForm').reset();
        
        // If username was changed, redirect to login after 3 seconds
        if (newUsername) {
          setTimeout(() => {
            showNotification('Please log in with your new credentials.', 'info');
            setTimeout(() => {
              window.location.href = '../member-login.html';
            }, 2000);
          }, 1000);
        }
       }
       
       // Handle security settings form submission
       function handleSecuritySubmission(formData) {
         const sessionTimeout = formData.get('sessionTimeout');
         const passwordPolicy = formData.get('passwordPolicy');
         const twoFactor = formData.get('twoFactor');
         
         // Validate session timeout
         if (sessionTimeout < 5 || sessionTimeout > 480) {
           showNotification('Session timeout must be between 5 and 480 minutes!', 'error');
           return;
         }
         
         // Mock successful save
         showNotification('Security settings saved successfully!', 'success');
         
         // In a real application, you would:
         // 1. Send the data to the server
         // 2. Update the application configuration
         // 3. Apply the new session timeout
         // 4. Update password policy enforcement
       }

  // Notification system
  window.showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()">&times;</button>
      </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#d4edda' : '#d1ecf1'};
      color: ${type === 'success' ? '#155724' : '#0c5460'};
      padding: 1rem;
      border-radius: 6px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  };

  // Mobile menu toggle (for responsive design)
  const mobileMenuToggle = document.createElement('button');
  mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
  mobileMenuToggle.className = 'mobile-menu-toggle';
  mobileMenuToggle.style.cssText = `
    display: none;
    position: fixed;
    top: 90px;
    left: 20px;
    z-index: 1001;
    background: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
  `;
  
  document.body.appendChild(mobileMenuToggle);
  
  mobileMenuToggle.addEventListener('click', () => {
    const sidebar = document.querySelector('.admin-sidebar');
    sidebar.classList.toggle('open');
  });

  // Hide mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.admin-sidebar');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });

  // Show mobile menu toggle on small screens
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  function handleMobileChange(e) {
    if (e.matches) {
      mobileMenuToggle.style.display = 'block';
    } else {
      mobileMenuToggle.style.display = 'none';
      document.querySelector('.admin-sidebar').classList.remove('open');
    }
  }
  
  mediaQuery.addListener(handleMobileChange);
  handleMobileChange(mediaQuery);

  // Initialize dashboard with sample data
  initializeDashboard();
});

// Dashboard initialization
function initializeDashboard() {
  // Load sample news data
  loadSampleNews();
  
  // Load sample FAQs
  loadSampleFAQs();
  
  // Load sample downloads
  loadSampleDownloads();
}

// Sample data loading functions
function loadSampleNews() {
  const newsTableBody = document.getElementById('news-table-body');
  if (!newsTableBody) return;
  
  const sampleNews = [
    {
      title: 'Annual General Meeting 2024',
      category: 'Event',
      date: '2024-03-15',
      status: 'Published'
    },
    {
      title: 'New Loan Products Available',
      category: 'Announcement',
      date: '2024-03-10',
      status: 'Published'
    },
    {
      title: 'Financial Literacy Workshop',
      category: 'Event',
      date: '2024-03-05',
      status: 'Draft'
    }
  ];
  
  newsTableBody.innerHTML = sampleNews.map(news => `
    <tr>
      <td>${news.title}</td>
      <td>${news.category}</td>
      <td>${news.date}</td>
      <td><span class="status ${news.status.toLowerCase()}">${news.status}</span></td>
      <td>
        <button class="btn-small">Edit</button>
        <button class="btn-small btn-danger">Delete</button>
      </td>
    </tr>
  `).join('');
}

function loadSampleFAQs() {
  const faqsTableBody = document.getElementById('faqs-table-body');
  if (!faqsTableBody) return;
  
  const sampleFAQs = [
    {
      question: 'How do I become a member?',
      category: 'Membership'
    },
    {
      question: 'What are the loan requirements?',
      category: 'Loans'
    },
    {
      question: 'How do I apply for a loan?',
      category: 'Loans'
    }
  ];
  
  faqsTableBody.innerHTML = sampleFAQs.map(faq => `
    <tr>
      <td>${faq.question}</td>
      <td>${faq.category}</td>
      <td>
        <button class="btn-small">Edit</button>
        <button class="btn-small btn-danger">Delete</button>
      </td>
    </tr>
  `).join('');
}

function loadSampleDownloads() {
  const downloadsTableBody = document.getElementById('downloads-table-body');
  if (!downloadsTableBody) return;
  
  const sampleDownloads = [
    {
      fileName: 'Membership Application Form.pdf',
      category: 'Forms',
      size: '245 KB',
      uploadDate: '2024-03-01'
    },
    {
      fileName: 'Annual Report 2023.pdf',
      category: 'Reports',
      size: '1.2 MB',
      uploadDate: '2024-02-15'
    },
    {
      fileName: 'Loan Policy Document.pdf',
      category: 'Policies',
      size: '890 KB',
      uploadDate: '2024-01-20'
    }
  ];
  
  downloadsTableBody.innerHTML = sampleDownloads.map(download => `
    <tr>
      <td>${download.fileName}</td>
      <td>${download.category}</td>
      <td>${download.size}</td>
      <td>${download.uploadDate}</td>
      <td>
        <button class="btn-small">Edit</button>
        <button class="btn-small btn-danger">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Team Management Functions
let currentEditId = null;

window.openTeamModal = () => {
  document.getElementById('teamModal').style.display = 'block';
  document.getElementById('teamModalTitle').textContent = 'Add Team Member';
  document.getElementById('teamForm').reset();
  currentEditId = null;
};

window.closeTeamModal = () => {
  document.getElementById('teamModal').style.display = 'none';
  document.getElementById('teamForm').reset();
  currentEditId = null;
};

window.editTeamMember = (id) => {
  const teamMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');
  const member = teamMembers.find(m => m.id === parseInt(id));
  
  if (member) {
    document.getElementById('teamModalTitle').textContent = 'Edit Team Member';
    document.querySelector('#teamForm [name="name"]').value = member.name;
    document.querySelector('#teamForm [name="role"]').value = member.role;
    document.querySelector('#teamForm [name="description"]').value = member.description || '';
    currentEditId = id;
    document.getElementById('teamModal').style.display = 'block';
  }
};

window.deleteTeamMember = (id) => {
  if (confirm('Are you sure you want to delete this team member?')) {
    let teamMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');
    teamMembers = teamMembers.filter(m => m.id !== parseInt(id));
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
    loadTeamData();
    showNotification('Team member deleted successfully!', 'success');
  }
};

function loadTeamData() {
  const teamMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');
  const tbody = document.getElementById('team-table-body');
  
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  teamMembers.forEach(member => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <div style="width: 40px; height: 40px; border-radius: 50%; background: #4CAF50; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
          ${member.photo ? `<img src="${member.photo}" alt="${member.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` : member.name.charAt(0)}
        </div>
      </td>
      <td>${member.name}</td>
      <td>${member.role}</td>
      <td>
        <button class="btn-small" onclick="editTeamMember(${member.id})" style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 4px; margin-right: 5px; cursor: pointer;">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn-small" onclick="deleteTeamMember(${member.id})" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Initialize team data loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Load team data
  setTimeout(() => {
    loadTeamData();
  }, 100);
  
  // Team form submission
  const teamForm = document.getElementById('teamForm');
  if (teamForm) {
    teamForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(teamForm);
      const name = formData.get('name');
      const role = formData.get('role');
      const description = formData.get('description');
      const photoFile = formData.get('photo');
      
      let teamMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');
      
      if (currentEditId) {
        // Edit existing member
        const memberIndex = teamMembers.findIndex(m => m.id === parseInt(currentEditId));
        if (memberIndex !== -1) {
          teamMembers[memberIndex].name = name;
          teamMembers[memberIndex].role = role;
          teamMembers[memberIndex].description = description;
          
          if (photoFile && photoFile.size > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
              teamMembers[memberIndex].photo = e.target.result;
              localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
              loadTeamData();
              closeTeamModal();
              showNotification('Team member updated successfully!', 'success');
            };
            reader.readAsDataURL(photoFile);
          } else {
            localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
            loadTeamData();
            closeTeamModal();
            showNotification('Team member updated successfully!', 'success');
          }
        }
      } else {
        // Add new member
        const newMember = {
          id: teamMembers.length > 0 ? Math.max(...teamMembers.map(m => m.id)) + 1 : 1,
          name: name,
          role: role,
          description: description,
          photo: null
        };
        
        if (photoFile && photoFile.size > 0) {
          const reader = new FileReader();
          reader.onload = (e) => {
            newMember.photo = e.target.result;
            teamMembers.push(newMember);
            localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
            loadTeamData();
            closeTeamModal();
            showNotification('Team member added successfully!', 'success');
          };
          reader.readAsDataURL(photoFile);
        } else {
          teamMembers.push(newMember);
          localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
          loadTeamData();
          closeTeamModal();
          showNotification('Team member added successfully!', 'success');
        }
      }
    });
  }
}); 