// Downloads page functionality
document.addEventListener('DOMContentLoaded', () => {
    loadDownloads();
    setupFilters();
    setupSearch();
});

// Load downloads from Django API
async function loadDownloads() {
    const downloadsContainer = document.querySelector('.downloads-grid');
    if (!downloadsContainer) return;

    try {
        // Show loading state
        downloadsContainer.innerHTML = '<div class="loading">Loading downloads...</div>';
        
        // Fetch from Django API
        const downloadsData = await api.getPublicDownloads();
        
        if (downloadsData.results && downloadsData.results.length > 0) {
            renderDownloads(downloadsData.results);
      } else {
            downloadsContainer.innerHTML = '<div class="no-results">No downloads available at this time.</div>';
        }
    } catch (error) {
        console.error('Error loading downloads:', error);
        downloadsContainer.innerHTML = '<div class="no-results">Unable to load downloads at this time.</div>';
    }
}

// Render downloads
function renderDownloads(downloads) {
    const downloadsContainer = document.querySelector('.downloads-grid');
    if (!downloadsContainer) return;

    downloadsContainer.innerHTML = '';

    downloads.forEach(download => {
        const downloadItem = createDownloadItem(download);
        downloadsContainer.appendChild(downloadItem);
    });
}

// Create download item element
function createDownloadItem(download) {
    const downloadItem = document.createElement('div');
    downloadItem.className = 'download-item';
    downloadItem.setAttribute('data-category', download.file_type);
    downloadItem.setAttribute('data-title', download.title.toLowerCase());

    const fileSize = download.file_size ? formatFileSize(download.file_size) : 'Unknown';
    const date = new Date(download.created_at).toLocaleDateString();

    downloadItem.innerHTML = `
        <div class="download-icon">
            <i class="fas ${getFileIcon(download.file_type)}"></i>
        </div>
        <div class="download-content">
            <h3>${download.title}</h3>
            <p>${download.description || 'No description available'}</p>
            <div class="download-meta">
                <span><i class="fas fa-file"></i> ${download.file_type.replace('_', ' ').toUpperCase()}</span>
                <span><i class="fas fa-download"></i> ${fileSize}</span>
                <span><i class="fas fa-calendar"></i> ${date}</span>
            </div>
            <a href="${download.file_url}" class="download-btn" download>
                <i class="fas fa-download"></i> Download
            </a>
      </div>
    `;
    
    return downloadItem;
}

// Get file icon based on file type
function getFileIcon(fileType) {
    const iconMap = {
        'financial_report': 'fa-chart-line',
        'policy': 'fa-shield-alt',
        'form': 'fa-file-alt',
        'guide': 'fa-book',
        'other': 'fa-file'
    };
    return iconMap[fileType] || 'fa-file';
}

// Format file size
function formatFileSize(bytes) {
    if (!bytes) return 'Unknown';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

// Setup filter functionality
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const downloadItems = document.querySelectorAll('.download-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter download items
            downloadItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show/hide no results message
            const visibleItems = document.querySelectorAll('.download-item[style="display: block"]');
            const noResults = document.getElementById('no-results');
            if (noResults) {
                noResults.style.display = visibleItems.length === 0 ? 'block' : 'none';
            }
        });
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const downloadItems = document.querySelectorAll('.download-item');

  downloadItems.forEach(item => {
            const title = item.getAttribute('data-title');
            const content = item.textContent.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        // Show/hide no results message
        const visibleItems = document.querySelectorAll('.download-item[style="display: block"]');
        const noResults = document.getElementById('no-results');
        if (noResults) {
            noResults.style.display = visibleItems.length === 0 ? 'block' : 'none';
        }
    });
} 