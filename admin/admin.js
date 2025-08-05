document.addEventListener('DOMContentLoaded', () => {
  // Check if API is available
  const isAPIAvailable = typeof api !== 'undefined';
  
  // Sidebar toggle functionality
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.admin-sidebar');
  const mainContent = document.querySelector('.admin-main');
  
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    mainContent.classList.toggle('sidebar-open');
  });
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('open');
        mainContent.classList.remove('sidebar-open');
      }
    }
  });

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
        case 'Add Gallery Item':
          showSection('gallery');
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

  window.openTeamModal = () => {
    const modal = document.getElementById('teamModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  window.openGalleryModal = () => {
    const modal = document.getElementById('galleryModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Set default date to today
    const dateInput = modal.querySelector('input[name="date"]');
    dateInput.value = new Date().toISOString().split('T')[0];
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

  window.closeTeamModal = () => {
    const modal = document.getElementById('teamModal');
    modal.classList.remove('show');
      document.body.style.overflow = 'auto';
    document.getElementById('teamForm').reset();
  };

  window.closeGalleryModal = () => {
    const modal = document.getElementById('galleryModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    document.getElementById('galleryForm').reset();
  };

  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => {
      if (e.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    });
  });

         // Form submissions
  document.getElementById('newsForm')?.addEventListener('submit', async (e) => {
           e.preventDefault();
    const formData = new FormData(e.target);
    await handleNewsSubmission(formData);
  });

  // FAQ and Download form submission handlers (handles both create and edit)
  document.getElementById('faqForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const editingId = e.target.dataset.editingId;
    
    if (editingId) {
      // Handle edit
      try {
        if (isAPIAvailable) {
          const faqData = {
            question: formData.get('question'),
            category: formData.get('category'),
            answer: formData.get('answer')
          };
          
          await api.updateFAQ(editingId, faqData);
          showNotification('FAQ updated successfully!', 'success');
          loadFAQData();
          loadDashboardStats();
          closeFAQModal();
          e.target.dataset.editingId = '';
          document.querySelector('#faqModal h2').textContent = 'Add FAQ';
        }
      } catch (error) {
        console.error('Error updating FAQ:', error);
        showNotification('Failed to update FAQ. Please try again.', 'error');
      }
    } else {
      // Handle create
      await handleFAQSubmission(formData);
    }
  });

  document.getElementById('downloadForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const editingId = e.target.dataset.editingId;
    
    if (editingId) {
      // Handle edit
      try {
        if (isAPIAvailable) {
          const downloadData = {
            title: formData.get('displayName'),
            file_type: formData.get('category'),
            description: formData.get('description')
          };
          
          await api.updateDownload(editingId, downloadData);
          showNotification('File updated successfully!', 'success');
          loadDownloadData();
          loadDashboardStats();
          closeDownloadModal();
          e.target.dataset.editingId = '';
          document.querySelector('#downloadModal h2').textContent = 'Upload File';
        }
      } catch (error) {
        console.error('Error updating download:', error);
        showNotification('Failed to update file. Please try again.', 'error');
      }
    } else {
      // Handle create
      await handleDownloadSubmission(formData);
    }
  });

  document.getElementById('teamForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await handleTeamSubmission(formData);
  });

  document.getElementById('galleryForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const editingId = e.target.dataset.editingId;
    
    if (editingId) {
      // Handle edit
      try {
        if (isAPIAvailable) {
          const galleryData = {
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            date: formData.get('date')
          };
          
          await api.updateGallery(editingId, galleryData);
          showNotification('Gallery item updated successfully!', 'success');
          loadGalleryData();
          loadDashboardStats();
          closeGalleryModal();
          e.target.dataset.editingId = '';
          document.querySelector('#galleryModal h2').textContent = 'Add Gallery Item';
        }
      } catch (error) {
        console.error('Error updating gallery item:', error);
        showNotification('Failed to update gallery item. Please try again.', 'error');
      }
    } else {
      // Handle create
      await handleGallerySubmission(formData);
    }
  });

  // Handle news form submission with API integration
  let editingNewsId = null;

  async function handleNewsSubmission(formData) {
    const newsData = {
      title: formData.get('title'),
      category: formData.get('category'),
      content: formData.get('content'),
      publish_date: formData.get('publishDate'),
      status: 'published'
    };
    
    try {
      if (isAPIAvailable) {
        if (editingNewsId) {
          await api.updateNews(editingNewsId, newsData);
          showNotification('News article updated successfully!', 'success');
        } else {
          await api.createNews(newsData);
          showNotification('News article published successfully!', 'success');
        }
        loadNewsData();
      } else {
        showNotification('API not available.', 'error');
      }
    
    closeNewsModal();
    editingNewsId = null;
    } catch (error) {
      console.error('Error saving news:', error);
      showNotification('Failed to save news article. Please try again.', 'error');
    }
  }

  // Handle FAQ form submission with API integration
  async function handleFAQSubmission(formData) {
    const faqData = {
      question: formData.get('question'),
      category: formData.get('category'),
      answer: formData.get('answer')
    };
    
    try {
      if (isAPIAvailable) {
        // Use Django API
        await api.createFAQ(faqData);
        showNotification('FAQ added successfully!', 'success');
        loadFAQData(); // Reload data from API
        loadDashboardStats(); // Update dashboard stats
      } else {
        // Fallback to local storage
    addFAQToTable(faqData);
        showNotification('FAQ added successfully!', 'success');
      }
    
    closeFAQModal();
    } catch (error) {
      console.error('Error creating FAQ:', error);
      showNotification('Failed to add FAQ. Please try again.', 'error');
    }
  }

  // Handle download form submission with API integration
  async function handleDownloadSubmission(formData) {
    const file = formData.get('file');
    const downloadData = {
      title: formData.get('displayName'),
      file_type: formData.get('category'), // Changed from 'category' to 'file_type'
      description: formData.get('description'),
      file: file
    };
    
    try {
      if (isAPIAvailable) {
        // Use Django API
        await api.createDownload(downloadData);
        showNotification('File uploaded successfully!', 'success');
        loadDownloadData(); // Reload data from API
        loadDashboardStats(); // Update dashboard stats
      } else {
        // Fallback to local storage
        const localData = {
      fileName: formData.get('displayName'),
      category: formData.get('category'),
      description: formData.get('description'),
      size: formatFileSize(file.size),
      uploadDate: new Date().toISOString().split('T')[0]
    };
        addDownloadToTable(localData);
        showNotification('File uploaded successfully!', 'success');
      }
    
    closeDownloadModal();
    } catch (error) {
      console.error('Error uploading file:', error);
      showNotification('Failed to upload file. Please try again.', 'error');
    }
  }

  // Handle team form submission
  async function handleTeamSubmission(formData) {
    const teamData = {
      name: formData.get('name'),
      role: formData.get('role'),
      description: formData.get('description')
    };
    
    // For now, use local storage for team data
    addTeamToTable(teamData);
    showNotification('Staff member added successfully!', 'success');
    closeTeamModal();
  }

  // Handle gallery form submission with API integration
  async function handleGallerySubmission(formData) {
    const file = formData.get('image');
    const galleryData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      date: formData.get('date'),
      image: file
    };
    
    try {
      if (isAPIAvailable) {
        // Use Django API
        await api.createGalleryItem(galleryData);
        showNotification('Gallery item added successfully!', 'success');
        loadGalleryData(); // Reload data from API
        loadDashboardStats(); // Update dashboard stats
      } else {
        // Fallback to local storage
        const localData = {
          title: formData.get('title'),
          description: formData.get('description'),
          category: formData.get('category'),
          date: formData.get('date'),
          imageUrl: URL.createObjectURL(file)
        };
        addGalleryToTable(localData);
        showNotification('Gallery item added successfully!', 'success');
      }
      
      closeGalleryModal();
    } catch (error) {
      console.error('Error creating gallery item:', error);
      showNotification('Failed to add gallery item. Please try again.', 'error');
    }
  }

  // Helper function to format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Load data from API
  async function loadNewsData() {
    if (!isAPIAvailable) return;
    
    try {
      const newsData = await api.getNews();
    const tbody = document.getElementById('news-table-body');
      if (tbody) {
        tbody.innerHTML = '';
        const news = newsData.results || newsData;
        news.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.category}</td>
            <td>${item.publish_date}</td>
            <td><span class="status ${item.status}">${item.status}</span></td>
            <td>
              <button class="btn-small" onclick="editNews(${item.id})">Edit</button>
              <button class="btn-small btn-danger" onclick="deleteNews(${item.id})">Delete</button>
      </td>
    `;
          tbody.appendChild(row);
        });
      }
    } catch (error) {
      console.error('Error loading news:', error);
    }
  }

  async function loadFAQData() {
    if (!isAPIAvailable) return;
    
    try {
      const faqData = await api.getFAQs();
    const tbody = document.getElementById('faqs-table-body');
      if (tbody) {
        tbody.innerHTML = '';
        const faqs = faqData.results || faqData;
        faqs.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${item.question}</td>
            <td>${item.category}</td>
      <td>
              <button class="btn-small" onclick="editFAQ(${item.id})">Edit</button>
              <button class="btn-small btn-danger" onclick="deleteFAQ(${item.id})">Delete</button>
      </td>
    `;
          tbody.appendChild(row);
        });
      }
    } catch (error) {
      console.error('Error loading FAQs:', error);
    }
  }

  async function loadDownloadData() {
    if (!isAPIAvailable) return;
    
    try {
      const downloadData = await api.getDownloads();
         const tbody = document.getElementById('downloads-table-body');
      if (tbody) {
        tbody.innerHTML = '';
        const downloads = downloadData.results || downloadData;
        downloads.forEach(item => {
         const row = document.createElement('tr');
         row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.file_type}</td>
            <td>${item.file ? 'Available' : 'N/A'}</td>
            <td>${new Date(item.created_at).toLocaleDateString()}</td>
            <td>
              <button class="btn-small" onclick="editDownload(${item.id})">Edit</button>
              <button class="btn-small btn-danger" onclick="deleteDownload(${item.id})">Delete</button>
           </td>
         `;
          tbody.appendChild(row);
        });
      }
    } catch (error) {
      console.error('Error loading downloads:', error);
    }
  }

  async function loadGalleryData() {
    if (!isAPIAvailable) return;
    
    try {
      const galleryData = await api.getGallery();
      const tbody = document.getElementById('gallery-table-body');
      if (tbody) {
        tbody.innerHTML = '';
        const items = galleryData.results || galleryData;
        items.forEach(item => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td><img src="${item.image_url || item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover;"></td>
            <td>${item.title}</td>
            <td>${item.category}</td>
            <td>${new Date(item.created_at).toLocaleDateString()}</td>
            <td>
              <button class="btn-small" onclick="editGallery(${item.id})">Edit</button>
              <button class="btn-small btn-danger" onclick="deleteGallery(${item.id})">Delete</button>
            </td>
          `;
          tbody.appendChild(row);
        });
      }
    } catch (error) {
      console.error('Error loading gallery:', error);
    }
  }

  // Load dashboard stats
  async function loadDashboardStats() {
    if (!isAPIAvailable) return;
    
    try {
      const stats = await api.getDashboardStats();
      document.getElementById('news-count').textContent = stats.total_news || 0;
      document.getElementById('faq-count').textContent = stats.total_faqs || 0;
      document.getElementById('download-count').textContent = stats.total_downloads || 0;
      document.getElementById('gallery-count').textContent = stats.total_gallery || 0;
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  }

  // Initialize dashboard
  async function initializeDashboard() {
    console.log('Initializing dashboard...');
    console.log('API available:', isAPIAvailable);
    
    // Load data from API if available
    if (isAPIAvailable) {
      try {
        await loadNewsData();
        await loadFAQData();
        await loadDownloadData();
        await loadGalleryData();
        await loadDashboardStats();
        console.log('Dashboard loaded with API data');
      } catch (error) {
        console.error('Error loading API data, falling back to sample data:', error);
        initializeDashboardFallback();
      }
    } else {
      // Load sample data for fallback
      console.log('Using fallback data (no API available)');
      initializeDashboardFallback();
    }
  }

  // Notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.color = 'white';
    notification.style.zIndex = '10000';
    notification.style.maxWidth = '300px';
    notification.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    
    // Set background color based on type
    switch(type) {
      case 'success':
        notification.style.backgroundColor = '#28a745';
        break;
      case 'error':
        notification.style.backgroundColor = '#dc3545';
        break;
      case 'warning':
        notification.style.backgroundColor = '#ffc107';
        notification.style.color = '#212529';
        break;
      default:
        notification.style.backgroundColor = '#17a2b8';
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
          setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  // Initialize dashboard on load
  initializeDashboard();
});

// Helper functions for adding data to tables (fallback)
function addNewsToTable(newsData) {
  const tbody = document.getElementById('news-table-body');
  if (tbody) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${newsData.title}</td>
      <td>${newsData.category}</td>
      <td>${newsData.publish_date || newsData.publishDate}</td>
      <td><span class="status ${(newsData.status || 'published').toLowerCase()}">${newsData.status || 'Published'}</span></td>
      <td>
        <button class="btn-small">Edit</button>
        <button class="btn-small btn-danger">Delete</button>
      </td>
    `;
    tbody.insertBefore(row, tbody.firstChild);
  }
}

function addFAQToTable(faqData) {
  const tbody = document.getElementById('faqs-table-body');
  if (tbody) {
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
}

function addDownloadToTable(downloadData) {
  const tbody = document.getElementById('downloads-table-body');
  if (tbody) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${downloadData.fileName || downloadData.title}</td>
      <td>${downloadData.category}</td>
      <td>${downloadData.description}</td>
      <td>${downloadData.uploadDate || downloadData.upload_date}</td>
      <td>
        <button class="btn-small">Edit</button>
        <button class="btn-small btn-danger">Delete</button>
      </td>
    `;
    tbody.insertBefore(row, tbody.firstChild);
  }
}

function addTeamToTable(teamData) {
  const tbody = document.getElementById('team-table-body');
  if (tbody) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${teamData.name}</td>
      <td>${teamData.role}</td>
      <td>${teamData.description}</td>
      <td>
        <button class="btn-small">Edit</button>
        <button class="btn-small btn-danger">Delete</button>
      </td>
    `;
    tbody.insertBefore(row, tbody.firstChild);
  }
}

function addGalleryToTable(galleryData) {
  const galleryContainer = document.getElementById('gallery-grid');
  if (galleryContainer) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.innerHTML = `
      <img src="${galleryData.imageUrl || galleryData.image}" alt="${galleryData.title}">
      <div class="gallery-item-info">
        <h4>${galleryData.title}</h4>
        <p>${galleryData.description}</p>
        <span class="gallery-category">${galleryData.category}</span>
      </div>
      <div class="gallery-item-actions">
        <button class="btn-small">Edit</button>
        <button class="btn-small btn-danger">Delete</button>
      </div>
    `;
    galleryContainer.appendChild(galleryItem);
  }
}

// Dashboard initialization (fallback)
function initializeDashboardFallback() {
  // Load sample news data
  loadSampleNews();
  
  // Load sample FAQs
  loadSampleFAQs();
  
  // Load sample downloads
  loadSampleDownloads();
  
  // Load team data
  loadTeamData();
  
  // Load feedback data
  loadFeedbackData();
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

// Load current admin username
function loadCurrentUsername() {
  const currentCredentials = JSON.parse(localStorage.getItem('adminCredentials') || '{"username": "admin", "password": "admin123"}');
  const usernameDisplay = document.getElementById('currentUsernameDisplay');
  if (usernameDisplay) {
    usernameDisplay.value = currentCredentials.username;
  }
}

// Hero Image Management
function setupHeroImageUpload() {
  const heroImageInput = document.getElementById('heroImageInput');
  const heroImagePreview = document.getElementById('heroImagePreview');
  
  if (heroImageInput) {
    // Show current hero image if exists
    const currentHeroImage = localStorage.getItem('heroImage');
    if (currentHeroImage) {
      heroImagePreview.innerHTML = `
        <div style="margin-top: 10px;">
          <label>Current Hero Image:</label>
          <img src="${currentHeroImage}" alt="Current Hero" style="max-width: 200px; height: auto; border-radius: 8px; display: block; margin-top: 5px;">
        </div>
      `;
    }
    
    heroImageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageDataUrl = event.target.result;
          localStorage.setItem('heroImage', imageDataUrl);
          
          // Update preview
          heroImagePreview.innerHTML = `
            <div style="margin-top: 10px;">
              <label>New Hero Image Preview:</label>
              <img src="${imageDataUrl}" alt="Hero Preview" style="max-width: 200px; height: auto; border-radius: 8px; display: block; margin-top: 5px;">
            </div>
          `;
          
          showNotification('Hero image updated successfully! Changes will be visible on the homepage.', 'success');
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

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
  // Load team data and current username
  setTimeout(() => {
    loadTeamData();
    loadCurrentUsername();
    setupHeroImageUpload();
    loadFeedbackData();
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

// Customer Feedback Management
function loadFeedbackData() {
  const feedbackList = JSON.parse(localStorage.getItem('customerFeedback') || '[]');
  const tbody = document.getElementById('feedback-table-body');
  const totalFeedback = document.getElementById('total-feedback');
  const unreadFeedback = document.getElementById('unread-feedback');
  
  if (!tbody) return;
  
  // Update stats
  if (totalFeedback) totalFeedback.textContent = feedbackList.length;
  if (unreadFeedback) {
    const unreadCount = feedbackList.filter(f => f.status === 'unread').length;
    unreadFeedback.textContent = unreadCount;
  }
  
  tbody.innerHTML = '';
  
  if (feedbackList.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #666; padding: 2rem;">No customer feedback received yet.</td></tr>';
    return;
  }
  
  feedbackList.forEach(feedback => {
    const date = new Date(feedback.date).toLocaleDateString();
    const messagePreview = feedback.message.substring(0, 50) + (feedback.message.length > 50 ? '...' : '');
    const statusClass = feedback.status === 'unread' ? 'unread' : 'read';
    
    const row = document.createElement('tr');
    row.className = feedback.status === 'unread' ? 'unread-feedback' : '';
    row.innerHTML = `
      <td>${date}</td>
      <td>${feedback.name}</td>
      <td>${feedback.email}</td>
      <td>${messagePreview}</td>
      <td><span class="status ${statusClass}">${feedback.status}</span></td>
      <td>
        <button class="btn-small" onclick="viewFeedback(${feedback.id})" style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 4px; margin-right: 5px; cursor: pointer;">
          <i class="fas fa-eye"></i> View
        </button>
        <button class="btn-small" onclick="deleteFeedback(${feedback.id})" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

window.viewFeedback = (id) => {
  const feedbackList = JSON.parse(localStorage.getItem('customerFeedback') || '[]');
  const feedback = feedbackList.find(f => f.id === id);
  
  if (feedback) {
    // Mark as read
    feedback.status = 'read';
    localStorage.setItem('customerFeedback', JSON.stringify(feedbackList));
    
    // Show feedback details in a modal/alert
    const date = new Date(feedback.date).toLocaleString();
    alert(`
Customer Feedback Details:

From: ${feedback.name}
Email: ${feedback.email}
Date: ${date}

Message:
${feedback.message}
    `);
    
    // Reload feedback data to update status
    loadFeedbackData();
  }
};

window.deleteFeedback = (id) => {
  if (confirm('Are you sure you want to delete this feedback message?')) {
    let feedbackList = JSON.parse(localStorage.getItem('customerFeedback') || '[]');
    feedbackList = feedbackList.filter(f => f.id !== id);
    localStorage.setItem('customerFeedback', JSON.stringify(feedbackList));
    loadFeedbackData();
    showNotification('Feedback message deleted successfully!', 'success');
  }
}; 

// Edit and Delete Functions for Downloads
window.editDownload = async (id) => {
  try {
    if (isAPIAvailable) {
      // Fetch download data from API
      const download = await api.getDownload(id);
      
      // Populate the modal with existing data
      const form = document.getElementById('downloadForm');
      form.querySelector('[name="displayName"]').value = download.title;
      form.querySelector('[name="category"]').value = download.file_type;
      form.querySelector('[name="description"]').value = download.description || '';
      
      // Store the editing ID
      form.dataset.editingId = id;
      
      // Update modal title
      document.querySelector('#downloadModal h2').textContent = 'Edit File';
      
      // Show the modal
      openDownloadModal();
    } else {
      showNotification('API not available for editing.', 'error');
    }
  } catch (error) {
    console.error('Error fetching download for edit:', error);
    showNotification('Failed to load download for editing.', 'error');
  }
};

window.deleteDownload = async (id) => {
  if (confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
    try {
      if (isAPIAvailable) {
        await api.deleteDownload(id);
        showNotification('File deleted successfully!', 'success');
        loadDownloadData();
        loadDashboardStats();
      } else {
        showNotification('API not available for deletion.', 'error');
      }
    } catch (error) {
      console.error('Error deleting download:', error);
      showNotification('Failed to delete file. Please try again.', 'error');
    }
  }
};

// Edit and Delete Functions for FAQs
window.editFAQ = async (id) => {
  try {
    if (isAPIAvailable) {
      // Fetch FAQ data from API
      const faq = await api.getFAQ(id);
      
      // Populate the modal with existing data
      const form = document.getElementById('faqForm');
      form.querySelector('[name="question"]').value = faq.question;
      form.querySelector('[name="category"]').value = faq.category;
      form.querySelector('[name="answer"]').value = faq.answer;
      
      // Store the editing ID
      form.dataset.editingId = id;
      
      // Update modal title
      document.querySelector('#faqModal h2').textContent = 'Edit FAQ';
      
      // Show the modal
      openFAQModal();
    } else {
      showNotification('API not available for editing.', 'error');
    }
  } catch (error) {
    console.error('Error fetching FAQ for edit:', error);
    showNotification('Failed to load FAQ for editing.', 'error');
  }
};

window.deleteFAQ = async (id) => {
  if (confirm('Are you sure you want to delete this FAQ? This action cannot be undone.')) {
    try {
      if (isAPIAvailable) {
        await api.deleteFAQ(id);
        showNotification('FAQ deleted successfully!', 'success');
        loadFAQData();
        loadDashboardStats();
      } else {
        showNotification('API not available for deletion.', 'error');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      showNotification('Failed to delete FAQ. Please try again.', 'error');
    }
  }
};

// Edit and Delete Functions for Gallery
window.editGallery = async (id) => {
  try {
    if (isAPIAvailable) {
      // Fetch gallery data from API
      const gallery = await api.getGalleryItem(id);
      
      // Populate the modal with existing data
      const form = document.getElementById('galleryForm');
      form.querySelector('[name="title"]').value = gallery.title;
      form.querySelector('[name="description"]').value = gallery.description;
      form.querySelector('[name="category"]').value = gallery.category;
      form.querySelector('[name="date"]').value = gallery.date;
      
      // Store the editing ID
      form.dataset.editingId = id;
      
      // Update modal title
      document.querySelector('#galleryModal h2').textContent = 'Edit Gallery Item';
      
      // Show the modal
      openGalleryModal();
    } else {
      showNotification('API not available for editing.', 'error');
    }
  } catch (error) {
    console.error('Error fetching gallery for edit:', error);
    showNotification('Failed to load gallery for editing.', 'error');
  }
};

window.deleteGallery = async (id) => {
  if (confirm('Are you sure you want to delete this gallery item? This action cannot be undone.')) {
    try {
      if (isAPIAvailable) {
        await api.deleteGallery(id);
        showNotification('Gallery item deleted successfully!', 'success');
        loadGalleryData();
        loadDashboardStats();
      } else {
        showNotification('API not available for deletion.', 'error');
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      showNotification('Failed to delete gallery item. Please try again.', 'error');
    }
  }
};



// Update modal close functions to reset editing state
function closeDownloadModal() {
  const modal = document.getElementById('downloadModal');
  const form = document.getElementById('downloadForm');
  modal.style.display = 'none';
  form.reset();
  form.dataset.editingId = '';
  document.querySelector('#downloadModal h2').textContent = 'Upload File';
}

function closeFAQModal() {
  const modal = document.getElementById('faqModal');
  const form = document.getElementById('faqForm');
  modal.style.display = 'none';
  form.reset();
  form.dataset.editingId = '';
  document.querySelector('#faqModal h2').textContent = 'Add FAQ';
}

function closeGalleryModal() {
  const modal = document.getElementById('galleryModal');
  const form = document.getElementById('galleryForm');
  modal.style.display = 'none';
  form.reset();
  form.dataset.editingId = '';
  document.querySelector('#galleryModal h2').textContent = 'Add Gallery Item';
} 