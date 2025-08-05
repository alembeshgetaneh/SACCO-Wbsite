from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import uuid


class User(AbstractUser):
    """Custom user model with role-based access"""
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('manager', 'Manager'),
        ('finance_officer', 'Finance Officer'),
        ('member', 'Member'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"


class Member(models.Model):
    """SACCO member model"""
    MEMBER_STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('suspended', 'Suspended'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='member_profile')
    member_id = models.CharField(max_length=20, unique=True)
    membership_date = models.DateField()
    status = models.CharField(max_length=20, choices=MEMBER_STATUS_CHOICES, default='active')
    emergency_contact_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True, null=True)
    employment_status = models.CharField(max_length=50, blank=True, null=True)
    employer_name = models.CharField(max_length=100, blank=True, null=True)
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.member_id} - {self.user.get_full_name()}"
    
    def save(self, *args, **kwargs):
        if not self.member_id:
            # Generate unique member ID
            self.member_id = f"MEM{str(uuid.uuid4())[:8].upper()}"
        super().save(*args, **kwargs)


class SavingsAccount(models.Model):
    """Member savings account"""
    ACCOUNT_TYPE_CHOICES = [
        ('regular', 'Regular Savings'),
        ('fixed', 'Fixed Deposit'),
        ('emergency', 'Emergency Fund'),
    ]
    
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='savings_accounts')
    account_number = models.CharField(max_length=20, unique=True)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPE_CHOICES, default='regular')
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.account_number} - {self.member.user.get_full_name()}"


class Loan(models.Model):
    """Member loan model"""
    LOAN_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('defaulted', 'Defaulted'),
        ('rejected', 'Rejected'),
    ]
    
    LOAN_TYPE_CHOICES = [
        ('personal', 'Personal Loan'),
        ('business', 'Business Loan'),
        ('emergency', 'Emergency Loan'),
        ('education', 'Education Loan'),
    ]
    
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='loans')
    loan_number = models.CharField(max_length=20, unique=True)
    loan_type = models.CharField(max_length=20, choices=LOAN_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    term_months = models.IntegerField()
    monthly_payment = models.DecimalField(max_digits=12, decimal_places=2)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    remaining_balance = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=LOAN_STATUS_CHOICES, default='pending')
    application_date = models.DateField(auto_now_add=True)
    approval_date = models.DateField(blank=True, null=True)
    disbursement_date = models.DateField(blank=True, null=True)
    due_date = models.DateField(blank=True, null=True)
    purpose = models.TextField()
    guarantor_name = models.CharField(max_length=100, blank=True, null=True)
    guarantor_phone = models.CharField(max_length=15, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.loan_number} - {self.member.user.get_full_name()}"


class Transaction(models.Model):
    """Financial transactions model"""
    TRANSACTION_TYPE_CHOICES = [
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
        ('loan_disbursement', 'Loan Disbursement'),
        ('loan_payment', 'Loan Payment'),
        ('interest', 'Interest'),
        ('fee', 'Fee'),
        ('transfer', 'Transfer'),
    ]
    
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='transactions')
    transaction_id = models.CharField(max_length=20, unique=True)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField()
    reference_number = models.CharField(max_length=50, blank=True, null=True)
    savings_account = models.ForeignKey(SavingsAccount, on_delete=models.CASCADE, blank=True, null=True)
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, blank=True, null=True)
    balance_after = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.transaction_id} - {self.member.user.get_full_name()}"


class Share(models.Model):
    """Member shares model"""
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='shares')
    share_number = models.CharField(max_length=20, unique=True)
    quantity = models.IntegerField(default=1)
    value_per_share = models.DecimalField(max_digits=10, decimal_places=2, default=100.00)
    total_value = models.DecimalField(max_digits=12, decimal_places=2)
    purchase_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.share_number} - {self.member.user.get_full_name()}"


class Dividend(models.Model):
    """Dividend distribution model"""
    year = models.IntegerField()
    amount_per_share = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    declaration_date = models.DateField()
    payment_date = models.DateField(blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Dividend {self.year} - {self.amount_per_share} per share"


class DividendPayment(models.Model):
    """Individual dividend payments to members"""
    dividend = models.ForeignKey(Dividend, on_delete=models.CASCADE, related_name='payments')
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='dividend_payments')
    shares_owned = models.IntegerField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    payment_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.member.user.get_full_name()} - {self.amount}"


class News(models.Model):
    """News and announcements model"""
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='news/', blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    is_published = models.BooleanField(default=False)
    published_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title


class FAQ(models.Model):
    """Frequently Asked Questions model"""
    question = models.TextField()
    answer = models.TextField()
    category = models.CharField(max_length=50, blank=True, null=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return self.question[:50] + "..."


class Download(models.Model):
    """Downloadable files model"""
    FILE_TYPE_CHOICES = [
        ('financial_report', 'Financial Report'),
        ('policy', 'Policy Document'),
        ('form', 'Application Form'),
        ('guide', 'User Guide'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='downloads/')
    file_type = models.CharField(max_length=20, choices=FILE_TYPE_CHOICES, default='other')
    file_size = models.IntegerField(blank=True, null=True)  # in bytes
    download_count = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title


class Gallery(models.Model):
    """Gallery images model"""
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='gallery/')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title


class ContactInfo(models.Model):
    """Contact information model"""
    BRANCH_CHOICES = [
        ('main', 'Main Branch'),
        ('branch1', 'Branch 1'),
        ('branch2', 'Branch 2'),
        ('branch3', 'Branch 3'),
    ]
    
    branch = models.CharField(max_length=20, choices=BRANCH_CHOICES, default='main')
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    address = models.TextField()
    working_hours = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.get_branch_display()} - {self.name}"


class CustomerFeedback(models.Model):
    """Customer feedback model"""
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True, null=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    admin_response = models.TextField(blank=True, null=True)
    responded_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    response_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.subject}"


class SystemSetting(models.Model):
    """System configuration settings"""
    SETTING_TYPE_CHOICES = [
        ('general', 'General'),
        ('financial', 'Financial'),
        ('email', 'Email'),
        ('security', 'Security'),
    ]
    
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    setting_type = models.CharField(max_length=20, choices=SETTING_TYPE_CHOICES, default='general')
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.key 