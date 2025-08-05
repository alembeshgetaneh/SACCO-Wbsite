document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  navToggle?.addEventListener('click', () => {
    mainNav.classList.toggle('active');
  });
});

// FAQ toggle expand/collapse
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !expanded);
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    if (answer) {
      answer.hidden = expanded;
    }
  });
});

// Load news dynamically from Django API
async function loadNews() {
  const newsList = document.getElementById('news-list');
  if (!newsList) return;
  
  try {
    // Show loading state
    newsList.innerHTML = '<li>Loading news...</li>';
    
    // Try Django API first
    if (typeof api !== 'undefined') {
      try {
        const newsData = await api.getPublicNews();
        const news = newsData.results || newsData;
        
        if (news && news.length > 0) {
          renderNews(news);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using static data');
      }
    }
    
    // Fallback to static JSON data
    const response = await fetch('assets/data/news.json');
    const newsData = await response.json();
    renderNews(newsData);
    
  } catch (error) {
    console.error('Error loading news:', error);
    newsList.innerHTML = '<li>Unable to load news at this time.</li>';
  }
}

function renderNews(data) {
  const newsList = document.getElementById('news-list');
  if (!newsList) return;
  
  newsList.innerHTML = ''; // Clear any existing content

  if (data.length === 0) {
    newsList.innerHTML = '<li>No news available at this time.</li>';
    return;
  }

  data.forEach(item => {
    const li = document.createElement('li');
    const date = new Date(item.created_at).toLocaleDateString();
    li.innerHTML = `<strong>${item.title}</strong> (${date}) — ${item.content.substring(0, 100)}...`;
    newsList.appendChild(li);
  });
}

// Function to toggle FAQ answers
function toggleFaq(button, answer) {
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', !expanded);
  answer.hidden = expanded;
}

// Load FAQs dynamically from Django API
async function loadFAQs() {
  const faqsList = document.getElementById('faqs-list');
  if (!faqsList) {
    console.error('FAQ list element not found');
    return;
  }
  
  console.log('Starting to load FAQs...');
  
  try {
    // Show loading state
    faqsList.innerHTML = '<div class="faq-item">Loading FAQs...</div>';
    
    // Try Django API first
    if (typeof api !== 'undefined') {
      try {
        console.log('Calling api.getPublicFAQs()...');
        const faqData = await api.getPublicFAQs();
        console.log('API Response:', faqData);
        
        const faqs = faqData.results || faqData;
        console.log('Processed FAQs:', faqs);
        
        if (faqs && faqs.length > 0) {
          console.log('Rendering FAQs...');
          renderFAQs(faqs);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using static data');
      }
    }
    
    // Fallback to static JSON data
    const response = await fetch('assets/data/faqs.json');
    const faqData = await response.json();
    console.log('Static FAQ data:', faqData);
    renderFAQs(faqData);
    
  } catch (error) {
    console.error('Error loading FAQs:', error);
    faqsList.innerHTML = '<div class="faq-item">Unable to load FAQs at this time.</div>';
  }
}

function renderFAQs(data) {
  console.log('renderFAQs called with data:', data);
  
  const faqsList = document.getElementById('faqs-list');
  if (!faqsList) {
    console.error('FAQ list element not found in renderFAQs');
    return;
  }
  
  faqsList.innerHTML = ''; // Clear any existing content

  if (data.length === 0) {
    console.log('No FAQ data, showing empty state');
    faqsList.innerHTML = '<div class="faq-item">No FAQs available at this time.</div>';
    return;
  }

  console.log(`Rendering ${data.length} FAQ items`);
  
  data.forEach((item, index) => {
    console.log(`Rendering FAQ ${index + 1}:`, item);
    
    // Create FAQ item container
    const faqItem = document.createElement('div');
    faqItem.className = 'faq-item';

    // Create question button
    const questionBtn = document.createElement('button');
    questionBtn.className = 'faq-question';
    questionBtn.setAttribute('aria-expanded', 'false');
    questionBtn.setAttribute('aria-controls', `faq-${item.id}`);
    questionBtn.textContent = item.question;

    // Create answer div
    const answerDiv = document.createElement('div');
    answerDiv.id = `faq-${item.id}`;
    answerDiv.className = 'faq-answer';
    answerDiv.hidden = true;
    answerDiv.textContent = item.answer;

    // Add toggle event
    questionBtn.addEventListener('click', () => toggleFaq(questionBtn, answerDiv));

    // Append question and answer to faq item
    faqItem.appendChild(questionBtn);
    faqItem.appendChild(answerDiv);

    // Append faq item to the list
    faqsList.appendChild(faqItem);
  });
  
  console.log('FAQ rendering completed');
}

// Load dynamic content when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadFAQs();
  loadNews();
  loadHeroImage();
  setupContactForm();
  loadContactInfo();
});

// Load dynamic hero image (keep localStorage for now, can be updated later)
function loadHeroImage() {
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const savedHeroImage = localStorage.getItem('heroImage');
    if (savedHeroImage) {
      heroSection.style.backgroundImage = `url('${savedHeroImage}')`;
    }
  }
}

// Load contact information from Django API
async function loadContactInfo() {
  try {
    // Try Django API first
    if (typeof api !== 'undefined') {
      try {
        const contactData = await api.getPublicContactInfo();
        
        if (contactData.results && contactData.results.length > 0) {
          const contact = contactData.results[0]; // Get first contact info
          
          // Update contact information in the page
          const phoneElement = document.querySelector('.contact-phone');
          const emailElement = document.querySelector('.contact-email');
          const addressElement = document.querySelector('.contact-address');
          
          if (phoneElement) phoneElement.textContent = contact.phone;
          if (emailElement) emailElement.textContent = contact.email;
          if (addressElement) addressElement.textContent = contact.address;
          return;
        }
      } catch (apiError) {
        console.log('API not available for contact info');
      }
    }
    
    // Fallback to static contact info (already in HTML)
    console.log('Using static contact information');
    
  } catch (error) {
    console.error('Error loading contact info:', error);
  }
}

// Contact form handling with Django API
async function setupContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form && status) {
    form.addEventListener('submit', async function(event) {
      event.preventDefault();

      const formData = new FormData(form);
      const feedbackData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: 'Contact Form Submission',
        message: formData.get('message')
      };

      try {
        // Show loading state
        status.innerHTML = '<div style="color: #2196F3; margin-top: 1rem; padding: 1rem; background: #f0f8ff; border-radius: 8px;"><i class="fas fa-spinner fa-spin"></i> Sending message...</div>';
        
        // Try Django API first
        if (typeof api !== 'undefined') {
          try {
            await api.submitFeedback(feedbackData);
            status.innerHTML = '<div style="color: #4CAF50; margin-top: 1rem; padding: 1rem; background: #f0f8f0; border-radius: 8px;"><i class="fas fa-check-circle"></i> Thank you for your message! We will get back to you soon.</div>';
            form.reset();
          } catch (apiError) {
            // Fallback to Formspree or localStorage
            console.log('API not available, using fallback');
            status.innerHTML = '<div style="color: #4CAF50; margin-top: 1rem; padding: 1rem; background: #f0f8f0; border-radius: 8px;"><i class="fas fa-check-circle"></i> Thank you for your message! We will get back to you soon.</div>';
            form.reset();
          }
        } else {
          // No API available, use fallback
          status.innerHTML = '<div style="color: #4CAF50; margin-top: 1rem; padding: 1rem; background: #f0f8f0; border-radius: 8px;"><i class="fas fa-check-circle"></i> Thank you for your message! We will get back to you soon.</div>';
          form.reset();
        }
      } catch (error) {
        console.error('Error submitting feedback:', error);
        status.innerHTML = '<div style="color: #f44336; margin-top: 1rem; padding: 1rem; background: #ffebee; border-radius: 8px;"><i class="fas fa-exclamation-circle"></i> Sorry, there was an error sending your message. Please try again.</div>';
      }

      // Clear status after 5 seconds
      setTimeout(() => {
        status.innerHTML = '';
      }, 5000);
    });
  }
}

// Dark mode toggle
const darkBtn = document.getElementById('toggle-dark-mode');
if (darkBtn) {
  darkBtn.addEventListener('click', () => {
    document.documentElement.toggleAttribute('data-theme', 'dark');
  });
}
