# Django SACCO System - Installation Guide

## Overview
This Django-based SACCO (Savings and Credit Cooperative Organization) management system provides a comprehensive backend API with role-based access control, financial management, content management, and admin interface.

## Features
- **User Management**: Role-based access (Admin, Manager, Finance Officer, Member)
- **Financial Management**: Savings accounts, loans, transactions, shares, dividends
- **Content Management**: News, FAQs, downloads, gallery, contact information
- **Customer Feedback**: Contact form with email notifications
- **Admin Interface**: Powerful Django admin panel
- **REST API**: Complete API for frontend integration
- **Security**: JWT authentication, password hashing, role-based permissions

## Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- Virtual environment (recommended)
- Database (SQLite for development, MySQL/PostgreSQL for production)

## Installation Steps

### 1. Clone or Download the Project
```bash
# If using git
git clone <repository-url>
cd SACCO-Website

# Or download and extract the project files
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
Create a `.env` file in the project root:
```bash
# Copy the example file
cp env_example.txt .env

# Edit .env with your settings
```

### 5. Database Setup
```bash
# Create database tables
python manage.py makemigrations
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser
```

### 6. Create Initial Data (Optional)
```bash
# Create sample data for testing
python manage.py shell
```

In the shell:
```python
from sacco_app.models import User, SystemSetting, ContactInfo
from django.contrib.auth.hashers import make_password

# Create default admin user
admin_user = User.objects.create(
    username='admin',
    email='admin@sacco.com',
    password=make_password('admin123'),
    first_name='Admin',
    last_name='User',
    role='admin',
    is_staff=True,
    is_superuser=True
)

# Create system settings
SystemSetting.objects.create(
    key='sacco_name',
    value='Your SACCO Name',
    setting_type='general',
    description='Name of the SACCO organization'
)

# Create contact info
ContactInfo.objects.create(
    branch='main',
    name='Main Branch',
    phone='+1234567890',
    email='info@sacco.com',
    address='123 Main Street, City, Country',
    working_hours='Monday-Friday: 8:00 AM - 5:00 PM'
)

exit()
```

### 7. Run the Development Server
```bash
python manage.py runserver
```

The application will be available at:
- **Main Site**: http://localhost:8000/
- **Admin Panel**: http://localhost:8000/admin/
- **API Root**: http://localhost:8000/api/

## API Endpoints

### Authentication
- `POST /api/token/` - Login (get JWT tokens)
- `POST /api/token/refresh/` - Refresh JWT token
- `POST /api/auth/register/` - User registration
- `POST /api/auth/change_password/` - Change password
- `POST /api/auth/logout/` - Logout

### User Management
- `GET /api/users/` - List users (admin only)
- `GET /api/users/profile/` - Get current user profile
- `PUT /api/users/update_profile/` - Update profile

### Financial Management
- `GET /api/members/` - List members
- `GET /api/savings-accounts/` - List savings accounts
- `POST /api/savings-accounts/{id}/deposit/` - Make deposit
- `POST /api/savings-accounts/{id}/withdraw/` - Make withdrawal
- `GET /api/loans/` - List loans
- `POST /api/loans/{id}/approve/` - Approve loan
- `POST /api/loans/{id}/disburse/` - Disburse loan
- `POST /api/loans/{id}/make_payment/` - Make loan payment

### Content Management
- `GET /api/news/` - List news
- `GET /api/faqs/` - List FAQs
- `GET /api/downloads/` - List downloads
- `GET /api/gallery/` - List gallery items
- `GET /api/contact-info/` - List contact information

### Public Endpoints (No Authentication Required)
- `GET /api/public/news/` - Published news
- `GET /api/public/faqs/` - Active FAQs
- `GET /api/public/downloads/` - Active downloads
- `GET /api/public/gallery/` - Active gallery items
- `GET /api/public/contact-info/` - Active contact info
- `POST /api/public/feedback/submit/` - Submit feedback

### Dashboard
- `GET /api/dashboard/` - Dashboard statistics (admin only)

## User Roles and Permissions

### Admin
- Full access to all features
- User management
- System settings
- Financial operations

### Manager
- Most admin privileges
- Cannot manage other admins
- Financial operations

### Finance Officer
- Financial operations only
- Savings accounts, loans, transactions
- Cannot manage users or content

### Member
- View own information only
- Limited access to personal data

## Database Configuration

### SQLite (Default - Development)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

### MySQL (Production)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'sacco_db',
        'USER': 'sacco_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

### PostgreSQL (Production)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'sacco_db',
        'USER': 'sacco_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## Email Configuration

### Console Backend (Development)
```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

### SMTP Backend (Production)
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
DEFAULT_FROM_EMAIL = 'noreply@sacco.com'
```

## Security Considerations

1. **Change Default Secret Key**: Update `SECRET_KEY` in `.env`
2. **Use HTTPS in Production**: Configure SSL certificates
3. **Database Security**: Use strong passwords and limit access
4. **Email Security**: Use app passwords for Gmail
5. **File Uploads**: Configure proper file size limits and validation
6. **CORS Settings**: Configure allowed origins for production

## Production Deployment

### Using Gunicorn
```bash
pip install gunicorn
gunicorn sacco_project.wsgi:application --bind 0.0.0.0:8000
```

### Using Docker (Optional)
Create a `Dockerfile`:
```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "sacco_project.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## Troubleshooting

### Common Issues

1. **Database Migration Errors**
   ```bash
   python manage.py makemigrations --empty sacco_app
   python manage.py migrate
   ```

2. **Static Files Not Loading**
   ```bash
   python manage.py collectstatic
   ```

3. **Email Not Working**
   - Check email settings in `.env`
   - Verify SMTP credentials
   - Check firewall settings

4. **Permission Errors**
   - Ensure proper file permissions
   - Check database user permissions

### Logs
Check Django logs for errors:
```bash
python manage.py runserver --verbosity=2
```

## Support

For issues and questions:
1. Check the Django documentation
2. Review the API endpoints
3. Check the admin panel for data issues
4. Verify environment configuration

## Next Steps

1. **Frontend Integration**: Connect your existing frontend to the Django API
2. **Customization**: Modify models and views for your specific needs
3. **Testing**: Add unit tests and integration tests
4. **Monitoring**: Add logging and monitoring
5. **Backup**: Set up database backups
6. **Documentation**: Create user documentation 