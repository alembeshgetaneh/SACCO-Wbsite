document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  navToggle?.addEventListener('click', () => {
    mainNav.classList.toggle('active');
  });
});



// Note: FAQ event listeners are now handled dynamically when FAQs are loaded from JSON
// This prevents duplicate event listeners and ensures all FAQs work properly





// Load news from JSON and render dynamically
fetch('assets/data/new.json')
  .then(response => response.json())
  .then(data => {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = ''; // Clear any existing content

    data.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${item.title}</strong> (${item.date}) — ${item.description}`;
      newsList.appendChild(li);
    });
  })
  .catch(error => {
    console.error('Error loading news:', error);
    // Add fallback content for better user experience
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = '<li>Unable to load news at this time. Please try again later.</li>';
  });




  // Function to toggle FAQ answers
function toggleFaq(button, answer) {
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', !expanded);
  answer.hidden = expanded;
}

// Load FAQs from JSON and render dynamically
fetch('assets/data/faqs.json')
  .then(response => response.json())
  .then(data => {
    const faqsList = document.getElementById('faqs-list');
    faqsList.innerHTML = ''; // Clear any existing content

    data.forEach(item => {
      // Create FAQ item container
      const faqItem = document.createElement('div');
      faqItem.className = 'faq-item';

      // Create question button
      const questionBtn = document.createElement('button');
      questionBtn.className = 'faq-question';
      questionBtn.setAttribute('aria-expanded', 'false');
      questionBtn.setAttribute('aria-controls', item.id);
      questionBtn.textContent = item.question;

      // Create answer div
      const answerDiv = document.createElement('div');
      answerDiv.id = item.id;
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
  })
  .catch(error => {
    console.error('Error loading FAQs:', error);
  });




// Contact form handling with improved security and error handling
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

if (form && status) {
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Clear previous status
    status.textContent = '';
    status.className = 'form-status';
    
    // Client-side validation
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    
    if (name.length < 2 || name.length > 50) {
      status.textContent = 'Name must be between 2 and 50 characters.';
      status.className = 'form-status error';
      return;
    }
    
    if (message.length < 10 || message.length > 1000) {
      status.textContent = 'Message must be between 10 and 1000 characters.';
      status.className = 'form-status error';
      return;
    }

    const data = new FormData(form);
    
    // Disable submit button during submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    fetch(form.action, {
      method: form.method,
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        status.textContent = 'Thank you for your message! We will get back to you soon.';
        status.className = 'form-status success';
        form.reset();
      } else {
        response.json().then(data => {
          if (Object.hasOwn(data, 'errors')) {
            status.textContent = data["errors"].map(error => error.message).join(", ");
          } else {
            status.textContent = 'Oops! There was a problem submitting your form';
          }
          status.className = 'form-status error';
        }).catch(() => {
          status.textContent = 'Oops! There was a problem submitting your form';
          status.className = 'form-status error';
        });
      }
    }).catch(error => {
      console.error('Form submission error:', error);
      status.textContent = 'Network error. Please check your connection and try again.';
      status.className = 'form-status error';
    }).finally(() => {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });
  });
}


// Dark mode toggle with proper error handling
const darkBtn = document.getElementById('toggle-dark-mode');
if (darkBtn) {
  darkBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  });
}
