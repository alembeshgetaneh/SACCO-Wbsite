// Django API Service
class SaccoAPI {
    constructor() {
        this.baseURL = 'http://localhost:8000/api';
        this.publicURL = 'http://localhost:8000/api/public';
    }

    // Generic API request method
    async makeRequest(url, options = {}) {
        try {
            // Don't set Content-Type for FormData requests
            const headers = {};
            if (!(options.body instanceof FormData)) {
                headers['Content-Type'] = 'application/json';
            }
            
            const response = await fetch(url, {
                headers: {
                    ...headers,
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`API Error ${response.status}:`, errorText);
                
                // If token is expired (401), try to refresh it
                if (response.status === 401) {
                    try {
                        await this.refreshToken();
                        // Retry the request with new token
                        const retryResponse = await fetch(url, {
                            headers: {
                                ...headers,
                                ...options.headers
                            },
                            ...options
                        });
                        
                        if (!retryResponse.ok) {
                            const retryErrorText = await retryResponse.text();
                            throw new Error(`HTTP error! status: ${retryResponse.status} - ${retryErrorText}`);
                        }
                        
                        return await retryResponse.json();
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        // Redirect to login if refresh fails
                        this.logout();
                        throw new Error('Authentication failed. Please login again.');
                    }
                }
                
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Get JWT token for authentication
    async login(username, password) {
        const response = await this.makeRequest(`${this.baseURL}/token/`, {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        return response;
    }

    // Refresh JWT token
    async refreshToken() {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await this.makeRequest(`${this.baseURL}/token/refresh/`, {
            method: 'POST',
            body: JSON.stringify({ refresh: refreshToken })
        });

        localStorage.setItem('access_token', response.access);
        return response;
    }

    // Get authenticated headers
    getAuthHeaders() {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.warn('No access token found. User may not be authenticated.');
        }
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    // Check if user is authenticated
    isAuthenticated() {
        const token = localStorage.getItem('access_token');
        return !!token;
    }

    // Public API endpoints (no authentication required)
    async getPublicNews() {
        return await this.makeRequest(`${this.publicURL}/news/`);
    }

    async getPublicFAQs() {
        return await this.makeRequest(`${this.publicURL}/faqs/`);
    }

    async getPublicDownloads() {
        return await this.makeRequest(`${this.publicURL}/downloads/`);
    }

    async getPublicGallery() {
        return await this.makeRequest(`${this.publicURL}/gallery/`);
    }

    async getPublicContactInfo() {
        return await this.makeRequest(`${this.publicURL}/contact-info/`);
    }

    // Submit feedback (public endpoint)
    async submitFeedback(feedbackData) {
        return await this.makeRequest(`${this.publicURL}/feedback/submit/`, {
            method: 'POST',
            body: JSON.stringify(feedbackData)
        });
    }

    // Authenticated API endpoints
    async getNews() {
        return await this.makeRequest(`${this.baseURL}/news/`, {
            headers: this.getAuthHeaders()
        });
    }

    async createNews(newsData) {
        return await this.makeRequest(`${this.baseURL}/news/`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(newsData)
        });
    }

    async updateNews(id, newsData) {
        return await this.makeRequest(`${this.baseURL}/news/${id}/`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(newsData)
        });
    }

    async deleteNews(id) {
        return await this.makeRequest(`${this.baseURL}/news/${id}/`, {
            method: 'DELETE',
            headers: this.getAuthHeaders()
        });
    }

    // FAQ management
    async getFAQs() {
        return await this.makeRequest(`${this.baseURL}/faqs/`, {
            headers: this.getAuthHeaders()
        });
    }

    async getFAQ(id) {
        return await this.makeRequest(`${this.baseURL}/faqs/${id}/`, {
            headers: this.getAuthHeaders()
        });
    }

    async createFAQ(faqData) {
        return await this.makeRequest(`${this.baseURL}/faqs/`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(faqData)
        });
    }

    async updateFAQ(id, faqData) {
        return await this.makeRequest(`${this.baseURL}/faqs/${id}/`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(faqData)
        });
    }

    async deleteFAQ(id) {
        return await this.makeRequest(`${this.baseURL}/faqs/${id}/`, {
            method: 'DELETE',
            headers: this.getAuthHeaders()
        });
    }

    // Download management
    async getDownloads() {
        return await this.makeRequest(`${this.baseURL}/downloads/`, {
            headers: this.getAuthHeaders()
        });
    }

    async getDownload(id) {
        return await this.makeRequest(`${this.baseURL}/downloads/${id}/`, {
            headers: this.getAuthHeaders()
        });
    }

    async createDownload(downloadData) {
        const formData = new FormData();
        for (const [key, value] of Object.entries(downloadData)) {
            formData.append(key, value);
        }

        return await this.makeRequest(`${this.baseURL}/downloads/`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: formData
        });
    }

    async updateDownload(id, downloadData) {
        return await this.makeRequest(`${this.baseURL}/downloads/${id}/`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(downloadData)
        });
    }

    async deleteDownload(id) {
        return await this.makeRequest(`${this.baseURL}/downloads/${id}/`, {
            method: 'DELETE',
            headers: this.getAuthHeaders()
        });
    }

    // Gallery management
    async getGallery() {
        return await this.makeRequest(`${this.baseURL}/gallery/`, {
            headers: this.getAuthHeaders()
        });
    }

    async getGalleryItem(id) {
        return await this.makeRequest(`${this.baseURL}/gallery/${id}/`, {
            headers: this.getAuthHeaders()
        });
    }

    async createGalleryItem(galleryData) {
        const formData = new FormData();
        for (const [key, value] of Object.entries(galleryData)) {
            formData.append(key, value);
        }

        return await this.makeRequest(`${this.baseURL}/gallery/`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: formData
        });
    }

    async updateGallery(id, galleryData) {
        return await this.makeRequest(`${this.baseURL}/gallery/${id}/`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(galleryData)
        });
    }

    async deleteGallery(id) {
        return await this.makeRequest(`${this.baseURL}/gallery/${id}/`, {
            method: 'DELETE',
            headers: this.getAuthHeaders()
        });
    }

    // Contact info management
    async getContactInfo() {
        return await this.makeRequest(`${this.baseURL}/contact-info/`, {
            headers: this.getAuthHeaders()
        });
    }

    async updateContactInfo(id, contactData) {
        return await this.makeRequest(`${this.baseURL}/contact-info/${id}/`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(contactData)
        });
    }

    // Dashboard statistics
    async getDashboardStats() {
        return await this.makeRequest(`${this.baseURL}/dashboard/`, {
            headers: this.getAuthHeaders()
        });
    }

    // User management
    async getUserProfile() {
        return await this.makeRequest(`${this.baseURL}/users/profile/`, {
            headers: this.getAuthHeaders()
        });
    }

    async updateUserProfile(profileData) {
        return await this.makeRequest(`${this.baseURL}/users/update_profile/`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(profileData)
        });
    }

    async changePassword(passwordData) {
        return await this.makeRequest(`${this.baseURL}/auth/change_password/`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(passwordData)
        });
    }

    // Logout
    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminLoginTime');
        window.location.href = '/admin-login.html';
    }
}

// Create global API instance
const api = new SaccoAPI(); 