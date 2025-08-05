# Maaddii SACCOs Website - Installation Guide

## Prerequisites

- **Web Server**: Apache/Nginx with PHP 7.4+ support
- **Database**: MySQL 5.7+ or MariaDB 10.2+
- **PHP Extensions**: PDO, PDO_MySQL, JSON, cURL, mbstring
- **Email Server**: SMTP server for email notifications

## Installation Steps

### 1. Database Setup

1. **Create Database**:
   ```sql
   CREATE DATABASE maaddii_sacco CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Import Schema**:
   ```bash
   mysql -u root -p maaddii_sacco < database/schema.sql
   ```

3. **Create Database User** (Optional but recommended):
   ```sql
   CREATE USER 'sacco_user'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL PRIVILEGES ON maaddii_sacco.* TO 'sacco_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### 2. Configuration Setup

1. **Update Database Configuration**:
   Edit `api/config.php` and update the database credentials:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'maaddii_sacco');
   define('DB_USER', 'sacco_user'); // or 'root'
   define('DB_PASS', 'your_secure_password');
   ```

2. **Update Email Configuration**:
   ```php
   define('SMTP_HOST', 'smtp.gmail.com');
   define('SMTP_PORT', 587);
   define('SMTP_USER', 'your-email@gmail.com');
   define('SMTP_PASS', 'your-app-password');
   define('FROM_EMAIL', 'noreply@maaddiisacco.com');
   ```

3. **Update Security Settings**:
   ```php
   define('JWT_SECRET', 'your-very-secure-secret-key-here');
   define('PASSWORD_SALT', 'your-very-secure-salt-here');
   ```

### 3. File Permissions

Set proper permissions for upload directories:
```bash
chmod 755 uploads/
chmod 755 assets/img/
chmod 755 assets/pdf/
```

### 4. Web Server Configuration

#### Apache Configuration
Create `.htaccess` file in the root directory:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/$1 [QSA,L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# PHP settings
php_value upload_max_filesize 10M
php_value post_max_size 10M
php_value max_execution_time 300
```

#### Nginx Configuration
Add to your nginx server block:
```nginx
location /api/ {
    try_files $uri $uri/ /api/index.php?$query_string;
}

location ~ \.php$ {
    fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
}
```

### 5. Initial Setup

1. **Access the Website**:
   Navigate to your website URL (e.g., `http://localhost/sacco-website`)

2. **Admin Login**:
   - Go to `member-login.html`
   - Use default credentials:
     - Username: `admin`
     - Password: `admin123`

3. **Change Default Password**:
   - Login to admin panel
   - Go to Settings → Admin Account
   - Change the default password

### 6. Content Setup

1. **Upload Images**:
   - Place logo in `assets/img/logo.png`
   - Place hero image in `assets/img/hero.jpg`
   - Add team photos to `assets/img/`

2. **Upload Documents**:
   - Place membership forms in `assets/pdf/`
   - Update download links in admin panel

3. **Configure Contact Information**:
   - Update phone, email, and address in admin panel
   - Add multiple branch information if needed

## Security Recommendations

### 1. Database Security
- Use strong passwords for database users
- Limit database user privileges
- Regularly backup database
- Enable SSL for database connections

### 2. Application Security
- Change default admin credentials immediately
- Use HTTPS in production
- Regularly update PHP and dependencies
- Implement rate limiting for API endpoints
- Enable CSRF protection

### 3. Server Security
- Keep server software updated
- Configure firewall rules
- Use SSL certificates
- Implement regular backups

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify database credentials in `api/config.php`
   - Check if MySQL service is running
   - Ensure database exists

2. **Email Not Working**:
   - Verify SMTP settings
   - Check if email server allows authentication
   - Test with different email provider

3. **File Upload Issues**:
   - Check file permissions
   - Verify PHP upload settings
   - Ensure upload directory exists

4. **Admin Panel Not Loading**:
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check server error logs

### Debug Mode

Enable debug mode by adding to `api/config.php`:
```php
define('DEBUG_MODE', true);
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## Maintenance

### Regular Tasks
1. **Database Backups**: Daily automated backups
2. **Log Monitoring**: Check error logs regularly
3. **Security Updates**: Keep all software updated
4. **Content Updates**: Regular content refresh
5. **Performance Monitoring**: Monitor website performance

### Backup Strategy
```bash
# Database backup
mysqldump -u root -p maaddii_sacco > backup_$(date +%Y%m%d).sql

# File backup
tar -czf files_backup_$(date +%Y%m%d).tar.gz assets/ uploads/
```

## Support

For technical support:
- Email: support@maaddiisacco.com
- Documentation: Check this file and code comments
- Issues: Report bugs through admin panel

## License

This project is licensed under the MIT License. See LICENSE file for details. 