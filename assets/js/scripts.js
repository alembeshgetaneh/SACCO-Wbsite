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





// Load news from JSON and render dynamically
fetch('assets/data/news.json')
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
  });




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

// Load FAQs when DOM is ready
document.addEventListener('DOMContentLoaded', loadFAQs);




  const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const data = new FormData(form);

  fetch(form.action, {
    method: form.method,
    body: data,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      status.textContent = 'Thank you for your message!';
      form.reset();
    } else {
      response.json().then(data => {
        if (Object.hasOwn(data, 'errors')) {
          status.textContent = data["errors"].map(error => error.message).join(", ");
        } else {
          status.textContent = 'Oops! There was a problem submitting your form';
        }
      });
    }
  }).catch(error => {
    status.textContent = 'Oops! There was a problem submitting your form';
  });
});


const darkBtn = document.getElementById('toggle-dark-mode');
darkBtn.addEventListener('click', () => {
  document.documentElement.toggleAttribute('data-theme', 'dark');
});
