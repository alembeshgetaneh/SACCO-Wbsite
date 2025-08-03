document.addEventListener('DOMContentLoaded', () => {
  // Sample gallery data
  const galleryData = [
    {
      id: 1,
      title: "Annual General Meeting 2024",
      description: "Members gathered for the annual general meeting to discuss SACCO progress and future plans.",
      category: "meetings",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      date: "2024-03-15"
    },
    {
      id: 2,
      title: "Financial Literacy Workshop",
      description: "Community members participating in financial education and literacy training session.",
      category: "training",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
      date: "2024-03-10"
    },
    {
      id: 3,
      title: "Community Outreach Program",
      description: "SACCO staff conducting community outreach to promote financial inclusion.",
      category: "community",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
      date: "2024-03-05"
    },
    {
      id: 4,
      title: "Loan Disbursement Ceremony",
      description: "Celebrating successful loan disbursements to community members.",
      category: "events",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      date: "2024-02-28"
    },
    {
      id: 5,
      title: "Board Meeting",
      description: "SACCO board members in strategic planning session.",
      category: "meetings",
      image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop",
      date: "2024-02-20"
    },
    {
      id: 6,
      title: "Savings Campaign Launch",
      description: "Launching new savings products and campaigns for members.",
      category: "events",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      date: "2024-02-15"
    },
    {
      id: 7,
      title: "Member Training Session",
      description: "Training session for new members on SACCO operations and benefits.",
      category: "training",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      date: "2024-02-10"
    },
    {
      id: 8,
      title: "Community Development Project",
      description: "SACCO supporting local community development initiatives.",
      category: "community",
      image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=400&h=300&fit=crop",
      date: "2024-02-05"
    },
    {
      id: 9,
      title: "Youth Empowerment Program",
      description: "Empowering young community members through financial education.",
      category: "training",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop",
      date: "2024-01-30"
    },
    {
      id: 10,
      title: "SACCO Anniversary Celebration",
      description: "Celebrating another successful year of community financial services.",
      category: "events",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop",
      date: "2024-01-25"
    },
    {
      id: 11,
      title: "Member Registration Drive",
      description: "Community members registering for SACCO membership.",
      category: "community",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      date: "2024-01-20"
    },
    {
      id: 12,
      title: "Financial Planning Workshop",
      description: "Workshop on personal financial planning and budgeting.",
      category: "training",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      date: "2024-01-15"
    }
  ];

  let currentFilter = 'all';
  let currentItems = 6;
  let filteredData = [...galleryData];

  // Initialize gallery
  initializeGallery();

  // Filter functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter data
      currentFilter = filter;
      filterGallery();
    });
  });

  // Load more functionality
  const loadMoreBtn = document.getElementById('load-more-btn');
  loadMoreBtn?.addEventListener('click', () => {
    currentItems += 6;
    renderGallery();
    
    // Hide load more button if all items are shown
    if (currentItems >= filteredData.length) {
      loadMoreBtn.style.display = 'none';
    }
  });

  // Initialize gallery
  function initializeGallery() {
    renderGallery();
  }

  // Filter gallery
  function filterGallery() {
    if (currentFilter === 'all') {
      filteredData = [...galleryData];
    } else {
      filteredData = galleryData.filter(item => item.category === currentFilter);
    }
    
    currentItems = 6;
    renderGallery();
    
    // Show/hide load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.style.display = filteredData.length > 6 ? 'block' : 'none';
    }
  }

  // Render gallery
  function renderGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    const itemsToShow = filteredData.slice(0, currentItems);
    
    galleryGrid.innerHTML = itemsToShow.map(item => `
      <div class="gallery-item" data-id="${item.id}">
        <div class="gallery-image-container">
          <img src="${item.image}" alt="${item.title}" class="gallery-image">
          <div class="gallery-overlay">
            <i class="fas fa-search-plus"></i>
          </div>
        </div>
        <div class="gallery-content">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div class="gallery-meta">
            <span class="gallery-date">${formatDate(item.date)}</span>
            <span class="gallery-category">${item.category}</span>
          </div>
        </div>
      </div>
    `).join('');
    
    // Add click event listeners to gallery items
    addGalleryItemListeners();
  }

  // Add event listeners to gallery items
  function addGalleryItemListeners() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const itemId = parseInt(item.getAttribute('data-id'));
        const itemData = filteredData.find(data => data.id === itemId);
        openLightbox(itemData);
      });
    });
  }

  // Open lightbox
  function openLightbox(itemData) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    
    lightboxImage.src = itemData.image;
    lightboxImage.alt = itemData.title;
    lightboxTitle.textContent = itemData.title;
    lightboxDescription.textContent = itemData.description;
    
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Update current item index for navigation
    currentItemIndex = filteredData.findIndex(item => item.id === itemData.id);
  }

  // Close lightbox
  function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('show');
    document.body.style.overflow = 'auto';
  }

  // Lightbox navigation
  let currentItemIndex = 0;
  
  function navigateLightbox(direction) {
    if (direction === 'next') {
      currentItemIndex = (currentItemIndex + 1) % filteredData.length;
    } else {
      currentItemIndex = currentItemIndex === 0 ? filteredData.length - 1 : currentItemIndex - 1;
    }
    
    const itemData = filteredData[currentItemIndex];
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    
    lightboxImage.src = itemData.image;
    lightboxImage.alt = itemData.title;
    lightboxTitle.textContent = itemData.title;
    lightboxDescription.textContent = itemData.description;
  }

  // Lightbox event listeners
  const closeLightboxBtn = document.querySelector('.close-lightbox');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const lightbox = document.getElementById('lightbox');

  closeLightboxBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => navigateLightbox('prev'));
  nextBtn?.addEventListener('click', () => navigateLightbox('next'));

  // Close lightbox when clicking outside
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('show')) {
      switch(e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateLightbox('prev');
          break;
        case 'ArrowRight':
          navigateLightbox('next');
          break;
      }
    }
  });

  // Helper function to format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Add CSS for gallery image container
  const style = document.createElement('style');
  style.textContent = `
    .gallery-image-container {
      position: relative;
      overflow: hidden;
    }
    
    .gallery-item {
      position: relative;
    }
  `;
  document.head.appendChild(style);
}); 