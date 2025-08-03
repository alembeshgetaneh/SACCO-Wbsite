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





// Load news dynamically from localStorage or fallback to JSON
function loadNews() {
  const newsList = document.getElementById('news-list');
  if (!newsList) return;
  
  // Try to load from localStorage first
  let newsData = JSON.parse(localStorage.getItem('news') || '[]');
  
  if (newsData.length === 0) {
    // Fallback to JSON file if no localStorage data
    fetch('assets/data/news.json')
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('news', JSON.stringify(data));
        renderNews(data);
      })
      .catch(error => {
        console.error('Error loading news:', error);
        renderNews([]);
      });
  } else {
    renderNews(newsData);
  }
}

function renderNews(data) {
  const newsList = document.getElementById('news-list');
  if (!newsList) return;
  
  newsList.innerHTML = ''; // Clear any existing content

  data.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${item.title}</strong> (${item.date}) — ${item.description}`;
    newsList.appendChild(li);
  });
}




  // Function to toggle FAQ answers
function toggleFaq(button, answer) {
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', !expanded);
  answer.hidden = expanded;
}

// Load FAQs dynamically from localStorage or fallback to JSON
function loadFAQs() {
  const faqsList = document.getElementById('faqs-list');
  if (!faqsList) return;
  
  // Try to load from localStorage first
  let faqData = JSON.parse(localStorage.getItem('faqs') || '[]');
  
  if (faqData.length === 0) {
    // Fallback to JSON file if no localStorage data
    fetch('assets/data/faqs.json')
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('faqs', JSON.stringify(data));
        renderFAQs(data);
      })
      .catch(error => {
        console.error('Error loading FAQs:', error);
        renderFAQs([]);
      });
  } else {
    renderFAQs(faqData);
  }
}

function renderFAQs(data) {
  const faqsList = document.getElementById('faqs-list');
  if (!faqsList) return;
  
  faqsList.innerHTML = ''; // Clear any existing content

  data.forEach(item => {
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
}

// Load dynamic content when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadFAQs();
  loadNews();
  loadHeroImage();
  setupContactForm();
});

// Load dynamic hero image
function loadHeroImage() {
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const savedHeroImage = localStorage.getItem('heroImage');
    if (savedHeroImage) {
      heroSection.style.backgroundImage = `url('${savedHeroImage}')`;
    }
  }
}




// Contact form handling with localStorage feedback storage
function setupContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form && status) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const formData = new FormData(form);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');

      // Create feedback object
      const feedback = {
        id: Date.now(),
        name: name,
        email: email,
        message: message,
        date: new Date().toISOString(),
        status: 'unread'
      };

      // Save to localStorage
      let feedbackList = JSON.parse(localStorage.getItem('customerFeedback') || '[]');
      feedbackList.unshift(feedback); // Add to beginning of array
      localStorage.setItem('customerFeedback', JSON.stringify(feedbackList));

      // Show success message
      status.innerHTML = '<div style="color: #4CAF50; margin-top: 1rem; padding: 1rem; background: #f0f8f0; border-radius: 8px;"><i class="fas fa-check-circle"></i> Thank you for your message! We will get back to you soon.</div>';
      form.reset();

      // Clear status after 5 seconds
      setTimeout(() => {
        status.innerHTML = '';
      }, 5000);
    });
  }
}

// Contact form setup is called in DOMContentLoaded above


const darkBtn = document.getElementById('toggle-dark-mode');
darkBtn.addEventListener('click', () => {
  document.documentElement.toggleAttribute('data-theme', 'dark');
});
