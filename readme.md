Maaddii SACCOs Website
Overview
Maaddii SACCOs Website is a modern, responsive, and accessible website for Maaddii SACCOs — a community-based financial cooperative empowering members through savings, loans, and financial education. The website provides up-to-date information, supports member engagement, and streamlines content management, optimized for all screen sizes.

Live Demo
View Live Site

Features
Responsive Design: Works seamlessly on mobile, tablet, and desktop devices.

Dynamic Content: News & FAQs are loaded from JSON files for easy updates.

Accessible Navigation: Hamburger menu with keyboard navigation and ARIA support.

Secure Contact Form: AJAX-powered form via Formspree with real-time feedback.

About Page: Shares the SACCO’s mission, vision, and introduces the team.

Services & Membership: Details on services, membership info, and downloadable forms.

Consistent Branding: Uses a green, blue, and gold palette for a professional identity.

Technologies Used
HTML5 for semantic markup

CSS3 for layout and responsive design

JavaScript for interactivity and dynamic content

Formspree for secure contact form handling

Font Awesome for icons

Project Structure
text
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

bash
git clone https://github.com/alembeshgetaneh/sacco-website.git
cd sacco-website
Open index.html in a modern web browser to view the site locally.

Deployment
The website is deployed on Netlify:
https://maaddiisaccco.netlify.app
Updates are automatic when you push changes to GitHub (if linked).

Update Content
Edit assets/data/news.json and assets/data/faqs.json for News & FAQs.

Replace or add images in assets/img/ as needed.

To commit and push updates:

bash
git add .
git commit -m "Update SACCO website content"
git push origin main
Contact
GitHub: alembeshgetaneh

Email: alembeshgetaneh@gmail.com

License
This project is open-source and licensed under the MIT License.

Future Improvements
Add backend for secure member login and admin dashboard

Enhance SEO and accessibility further