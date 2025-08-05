-- Maaddii SACCOs Database Schema
-- This schema provides a complete database structure for the SACCO system

-- Users and Authentication
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('admin', 'manager', 'finance_officer', 'member') NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- SACCO Members
CREATE TABLE members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    member_id VARCHAR(20) UNIQUE NOT NULL,
    user_id INT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    occupation VARCHAR(100),
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    membership_date DATE NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Savings Accounts
CREATE TABLE savings_accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    account_type ENUM('voluntary', 'fixed', 'compulsory') NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    interest_rate DECIMAL(5,4) DEFAULT 0.0000,
    status ENUM('active', 'inactive', 'frozen') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- Savings Transactions
CREATE TABLE savings_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT NOT NULL,
    transaction_type ENUM('deposit', 'withdrawal', 'interest', 'fee') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    balance_before DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    description TEXT,
    reference_number VARCHAR(50),
    processed_by INT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES savings_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Loans
CREATE TABLE loans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    loan_number VARCHAR(20) UNIQUE NOT NULL,
    loan_type ENUM('personal', 'business', 'education', 'emergency') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    interest_rate DECIMAL(5,4) NOT NULL,
    term_months INT NOT NULL,
    monthly_payment DECIMAL(15,2) NOT NULL,
    total_payable DECIMAL(15,2) NOT NULL,
    status ENUM('pending', 'approved', 'active', 'completed', 'defaulted') DEFAULT 'pending',
    approved_by INT,
    approved_date TIMESTAMP NULL,
    disbursement_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Loan Payments
CREATE TABLE loan_payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    loan_id INT NOT NULL,
    payment_amount DECIMAL(15,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method ENUM('cash', 'bank_transfer', 'mobile_money') NOT NULL,
    reference_number VARCHAR(50),
    processed_by INT,
    FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Shares
CREATE TABLE shares (
    id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    share_type ENUM('ordinary', 'preference') DEFAULT 'ordinary',
    quantity INT NOT NULL,
    price_per_share DECIMAL(10,2) NOT NULL,
    total_value DECIMAL(15,2) NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- Dividends
CREATE TABLE dividends (
    id INT PRIMARY KEY AUTO_INCREMENT,
    year INT NOT NULL,
    total_profit DECIMAL(15,2) NOT NULL,
    dividend_per_share DECIMAL(10,4) NOT NULL,
    declaration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_date TIMESTAMP NULL,
    status ENUM('declared', 'paid') DEFAULT 'declared',
    declared_by INT,
    FOREIGN KEY (declared_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Dividend Payments
CREATE TABLE dividend_payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dividend_id INT NOT NULL,
    member_id INT NOT NULL,
    shares_owned INT NOT NULL,
    dividend_amount DECIMAL(15,2) NOT NULL,
    payment_date TIMESTAMP NULL,
    status ENUM('pending', 'paid') DEFAULT 'pending',
    FOREIGN KEY (dividend_id) REFERENCES dividends(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- News and Announcements
CREATE TABLE news (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    publish_date DATE NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- FAQs
CREATE TABLE faqs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Downloads
CREATE TABLE downloads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    file_type VARCHAR(50),
    category VARCHAR(100),
    is_public BOOLEAN DEFAULT TRUE,
    download_count INT DEFAULT 0,
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Gallery
CREATE TABLE gallery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_path VARCHAR(500) NOT NULL,
    thumbnail_path VARCHAR(500),
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Contact Information
CREATE TABLE contact_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    branch_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Customer Feedback
CREATE TABLE customer_feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    replied_by INT,
    reply_message TEXT,
    reply_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (replied_by) REFERENCES users(id) ON DELETE SET NULL
);

-- System Settings
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default admin user
INSERT INTO users (username, password_hash, email, role, first_name, last_name) 
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@maaddiisacco.com', 'admin', 'System', 'Administrator');

-- Insert default contact information
INSERT INTO contact_info (branch_name, phone, email, address, is_primary) 
VALUES ('Main Branch', '+25118239621', 'maaddiisaccos@gmail.com', 'Weliso, Oromia region, Ethiopia', TRUE);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('sacco_name', 'Maaddii SACCOs', 'Name of the SACCO'),
('sacco_logo', 'assets/img/logo.png', 'Path to SACCO logo'),
('hero_image', 'assets/img/hero.jpg', 'Path to hero image'),
('default_language', 'en', 'Default language for the website'),
('maintenance_mode', 'false', 'Whether the system is in maintenance mode'); 