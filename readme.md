Maaddii SACCOs Website
A modern, responsive, and accessible website for Maaddii SACCOs—a community-based financial cooperative dedicated to empowering members through savings, loans, and financial education.

Features
Responsive Design: Works beautifully on mobile, tablet, and desktop devices.

Dynamic News & FAQs: Loads announcements and frequently asked questions from JSON files for easy updates.

Accessible Navigation: Hamburger menu and keyboard-friendly site navigation with ARIA support.

Contact Form: Secure contact form with AJAX submission via Formspree, including error and success feedback.

About Page: Meet the team, learn about the mission, vision, and SACCO’s story.

Services: Detailed overview of savings, loan products, and other member services.

Membership Info: Clear joining requirements and downloadable membership application.

Consistent Branding: Clean, professional look with SACCO’s green, blue, and gold color palette.

Getting Started
Prerequisites
Modern web browser

No server required; pure static site (HTML, CSS, JS, JSON assets)

Folder Structure
text
/
├── index.html
├── about.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── scripts.js
│   ├── img/
│   │   └── (images, team photos)
│   ├── data/
│   │   ├── faqs.json
│   │   └── news.json
│   └── pdf/
│       └── membership-form.pdf
Installation & Usage
Clone or Download:

bash
git clone https://github.com/alembesh/sacco-website.git
cd sacco-website
Open index.html in your web browser.

Edit/Update content:

News & FAQs: Update assets/data/news.json and faqs.json.

Images: Replace/add images in assets/img/.

Deployment
Deploy easily to Netlify, Vercel, or GitHub Pages by uploading the entire project folder.

No backend/server setup required for public site.

Contributing
Fork the repo

Make changes on your branch

Submit Pull Requests for review

License
This project is open source

Credits
Icons: Font Awesome

Form handling: Formspree

Developed by [Alembesh Getaneh]

Feel free to edit the README with your SACCO’s real details, add screenshots, project goals, and any extra setup notes if your deployment process changes!