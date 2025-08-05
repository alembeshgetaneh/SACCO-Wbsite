// Gallery page functionality
document.addEventListener('DOMContentLoaded', () => {
    loadGallery();
    setupFilters();
    setupLightbox();
});

// Load gallery from Django API
async function loadGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;

    try {
        // Show loading state
        galleryGrid.innerHTML = '<div class="loading">Loading gallery...</div>';
        
        // Fetch from Django API
        const galleryData = await api.getPublicGallery();
        
        if (galleryData.results && galleryData.results.length > 0) {
            renderGallery(galleryData.results);
        } else {
            galleryGrid.innerHTML = '<div class="no-results">No gallery items available at this time.</div>';
        }
    } catch (error) {
        console.error('Error loading gallery:', error);
        galleryGrid.innerHTML = '<div class="no-results">Unable to load gallery at this time.</div>';
    }
}

// Render gallery items
function renderGallery(items) {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;

    galleryGrid.innerHTML = '';

    items.forEach(item => {
        const galleryItem = createGalleryItem(item);
        galleryGrid.appendChild(galleryItem);
    });
}

// Create gallery item element
function createGalleryItem(item) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('data-category', 'all'); // Default category
    galleryItem.setAttribute('data-title', item.title.toLowerCase());

    galleryItem.innerHTML = `
        <div class="gallery-image">
            <img src="${item.image_url}" alt="${item.title}" loading="lazy">
            <div class="gallery-overlay">
                <div class="gallery-info">
                    <h3>${item.title}</h3>
                    <p>${item.description || 'No description available'}</p>
                    <button class="view-btn" onclick="openLightbox('${item.image_url}', '${item.title}', '${item.description || ''}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        </div>
    `;

    return galleryItem;
}

// Setup filter functionality
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-filter');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Lightbox functionality
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Close lightbox
    closeBtn?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox('prev');
            } else if (e.key === 'ArrowRight') {
                navigateLightbox('next');
            }
        }
    });

    // Navigation buttons
    prevBtn?.addEventListener('click', () => navigateLightbox('prev'));
    nextBtn?.addEventListener('click', () => navigateLightbox('next'));
}

// Open lightbox
function openLightbox(imageSrc, title, description) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');

    if (lightbox && lightboxImage && lightboxTitle && lightboxDescription) {
        lightboxImage.src = imageSrc;
        lightboxImage.alt = title;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        lightbox.style.display = 'block';
        
        // Store current item info for navigation
        lightbox.setAttribute('data-current-image', imageSrc);
        lightbox.setAttribute('data-current-title', title);
        lightbox.setAttribute('data-current-description', description);
    }
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
    }
}

// Navigate lightbox (placeholder for future implementation)
function navigateLightbox(direction) {
    // This would be implemented to navigate between gallery items
    // For now, it's a placeholder
    console.log(`Navigate ${direction} in lightbox`);
}

// Load more functionality (placeholder)
document.getElementById('load-more-btn')?.addEventListener('click', () => {
    // This would load more gallery items
    // For now, it's a placeholder
    console.log('Load more gallery items');
}); 