Maaddii SACCOs Website
Overview
Maaddii SACCOs Website is a modern, responsive, and accessible website for Maaddii SACCOs — a community-based financial cooperative empowering members through savings, loans, and financial education.
Live Demo
https://maaddiisaccco.netlify.app
Features
• Responsive design for mobile, tablet, and desktop
• Dynamic News & FAQs loaded from JSON for easy updates
• Accessible hamburger menu and keyboard navigation with ARIA support
• Secure AJAX contact form via Formspree with feedback
• About page describing mission, vision, and team
• Detailed services and membership info, including downloadable forms
• Consistent branding with green, blue, and gold palette
Technologies Used
• HTML5
• CSS3
• JavaScript
• Formspree (contact form handling)
• Font Awesome (icons)
Project Structure
sacco-website/
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

Setup & Usage
Clone the repository:
git clone https://github.com/alembeshgetaneh/sacco-website.git
cd sacco-website
Open index.html in a modern web browser to view the site locally.
Deployment
Deployed on Netlify at https://maaddiisaccco.netlify.app
Updates are automatic when pushing to GitHub (if connected).
Update Content
- Edit assets/data/news.json and assets/data/faqs.json for news & FAQs
- Replace images in assets/img/ as needed
Commit and push updates:
git add .
git commit -m "Update SACCO website content"
git push origin main
Contact
GitHub: https://github.com/alembeshgetaneh
Email: alembeshgetaneh@gmail.com
License
This project is open source and licensed under the MIT License.
Future Improvements
• Add backend for secure member login and admin dashboard
• Enhance SEO and accessibility further