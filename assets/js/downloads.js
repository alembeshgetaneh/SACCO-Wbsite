document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-downloads');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const downloadItems = document.querySelectorAll('.download-item');
  const downloadsGrid = document.getElementById('downloads-grid');
  const noResults = document.getElementById('no-results');

  let currentFilter = 'all';
  let currentSearch = '';

  // Search functionality
  searchInput?.addEventListener('input', (e) => {
    currentSearch = e.target.value.toLowerCase().trim();
    filterDownloads();
  });

  // Filter functionality
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      btn.classList.add('active');
      
      // Update current filter
      currentFilter = btn.getAttribute('data-filter');
      
      // Apply filters
      filterDownloads();
    });
  });

  // Combined search and filter function
  function filterDownloads() {
    let visibleCount = 0;

    downloadItems.forEach(item => {
      const category = item.getAttribute('data-category');
      const title = item.querySelector('h3').textContent.toLowerCase();
      const description = item.querySelector('p').textContent.toLowerCase();
      const content = `${title} ${description}`;

      // Check if item matches current filter and search
      const matchesFilter = currentFilter === 'all' || category === currentFilter;
      const matchesSearch = currentSearch === '' || content.includes(currentSearch);

      if (matchesFilter && matchesSearch) {
        item.style.display = 'flex';
        visibleCount++;
        
        // Add animation
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          item.style.transition = 'all 0.3s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 50);
      } else {
        item.style.display = 'none';
      }
    });

    // Show/hide no results message
    if (visibleCount === 0) {
      noResults.style.display = 'block';
      downloadsGrid.style.display = 'none';
    } else {
      noResults.style.display = 'none';
      downloadsGrid.style.display = 'grid';
    }
  }

  // Download tracking
  const downloadButtons = document.querySelectorAll('.download-btn');
  
  downloadButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const fileName = btn.getAttribute('href').split('/').pop();
      const fileTitle = btn.closest('.download-item').querySelector('h3').textContent;
      
      // Track download (in real app, send to analytics)
      trackDownload(fileName, fileTitle);
      
      // Show download confirmation
      showDownloadConfirmation(fileTitle);
    });
  });

  function trackDownload(fileName, fileTitle) {
    // In a real application, you would send this data to your analytics service
    console.log(`Download tracked: ${fileTitle} (${fileName})`);
    
    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'download', {
        'event_category': 'document',
        'event_label': fileTitle,
        'value': 1
      });
    }
  }

  function showDownloadConfirmation(fileTitle) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-check-circle"></i>
        <span>Download started: ${fileTitle}</span>
      </div>
    `;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Keyboard navigation for accessibility
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      currentSearch = '';
      filterDownloads();
    }
  });

  // Focus management
  filterButtons.forEach((btn, index) => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        const nextBtn = filterButtons[index + 1] || filterButtons[0];
        nextBtn.focus();
      } else if (e.key === 'ArrowLeft') {
        const prevBtn = filterButtons[index - 1] || filterButtons[filterButtons.length - 1];
        prevBtn.focus();
      }
    });
  });

  // Download statistics (mock data)
  function updateDownloadStats() {
    const stats = {
      'membership-application.pdf': 156,
      'loan-application.pdf': 89,
      'annual-report-2024.pdf': 234,
      'financial-statement-q4-2024.pdf': 67,
      'member-guidebook.pdf': 189,
      'financial-literacy-guide.pdf': 145,
      'loan-policy.pdf': 78,
      'savings-policy.pdf': 92,
      'membership-bylaws.pdf': 56
    };

    // Update download counts (if you want to show them)
    downloadItems.forEach(item => {
      const downloadBtn = item.querySelector('.download-btn');
      const fileName = downloadBtn.getAttribute('href').split('/').pop();
      const downloadCount = stats[fileName] || 0;
      
      // You could add download count display here
      // const countElement = item.querySelector('.download-count');
      // if (countElement) {
      //   countElement.textContent = `${downloadCount} downloads`;
      // }
    });
  }

  // Initialize download stats
  updateDownloadStats();

  // Add loading animation for downloads
  downloadButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
      btn.style.pointerEvents = 'none';
      
      // Reset after a short delay (simulating download time)
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.pointerEvents = 'auto';
      }, 2000);
    });
  });

  // Add hover effects for better UX
  downloadItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateY(-4px)';
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateY(0)';
    });
  });

  // Search suggestions (optional)
  const searchSuggestions = [
    'membership',
    'loan',
    'application',
    'form',
    'report',
    'policy',
    'guide',
    'financial',
    'annual',
    'bylaws'
  ];

  // Add search suggestions on focus
  searchInput?.addEventListener('focus', () => {
    if (!searchInput.value) {
      const suggestion = searchSuggestions[Math.floor(Math.random() * searchSuggestions.length)];
      searchInput.placeholder = `Try searching for "${suggestion}"...`;
    }
  });

  searchInput?.addEventListener('blur', () => {
    searchInput.placeholder = 'Search documents...';
  });
}); 