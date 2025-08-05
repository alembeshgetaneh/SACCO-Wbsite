from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    User, Member, SavingsAccount, Loan, Transaction, Share, 
    Dividend, DividendPayment, News, FAQ, Download, Gallery, 
    ContactInfo, CustomerFeedback, SystemSetting
)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Custom user admin"""
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = UserAdmin.fieldsets + (
        ('SACCO Information', {'fields': ('role', 'phone_number', 'address', 'date_of_birth', 'profile_picture')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('SACCO Information', {'fields': ('role', 'phone_number', 'address', 'date_of_birth')}),
    )


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    """Member admin"""
    list_display = ['member_id', 'user', 'status', 'membership_date', 'created_at']
    list_filter = ['status', 'membership_date', 'created_at']
    search_fields = ['member_id', 'user__first_name', 'user__last_name', 'user__email']
    ordering = ['-created_at']
    readonly_fields = ['member_id', 'created_at', 'updated_at']


@admin.register(SavingsAccount)
class SavingsAccountAdmin(admin.ModelAdmin):
    """Savings account admin"""
    list_display = ['account_number', 'member', 'account_type', 'balance', 'is_active', 'created_at']
    list_filter = ['account_type', 'is_active', 'created_at']
    search_fields = ['account_number', 'member__user__first_name', 'member__user__last_name']
    ordering = ['-created_at']
    readonly_fields = ['account_number', 'created_at', 'updated_at']


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    """Loan admin"""
    list_display = ['loan_number', 'member', 'loan_type', 'amount', 'status', 'application_date']
    list_filter = ['loan_type', 'status', 'application_date', 'created_at']
    search_fields = ['loan_number', 'member__user__first_name', 'member__user__last_name']
    ordering = ['-created_at']
    readonly_fields = ['loan_number', 'application_date', 'created_at', 'updated_at']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    """Transaction admin"""
    list_display = ['transaction_id', 'member', 'transaction_type', 'amount', 'created_at']
    list_filter = ['transaction_type', 'created_at']
    search_fields = ['transaction_id', 'member__user__first_name', 'member__user__last_name']
    ordering = ['-created_at']
    readonly_fields = ['transaction_id', 'created_at']


@admin.register(Share)
class ShareAdmin(admin.ModelAdmin):
    """Share admin"""
    list_display = ['share_number', 'member', 'quantity', 'total_value', 'is_active', 'purchase_date']
    list_filter = ['is_active', 'purchase_date', 'created_at']
    search_fields = ['share_number', 'member__user__first_name', 'member__user__last_name']
    ordering = ['-created_at']
    readonly_fields = ['share_number', 'purchase_date', 'created_at', 'updated_at']


@admin.register(Dividend)
class DividendAdmin(admin.ModelAdmin):
    """Dividend admin"""
    list_display = ['year', 'amount_per_share', 'total_amount', 'is_paid', 'declaration_date']
    list_filter = ['year', 'is_paid', 'declaration_date', 'created_at']
    ordering = ['-year', '-created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(DividendPayment)
class DividendPaymentAdmin(admin.ModelAdmin):
    """Dividend payment admin"""
    list_display = ['dividend', 'member', 'shares_owned', 'amount', 'is_paid', 'payment_date']
    list_filter = ['dividend__year', 'is_paid', 'payment_date', 'created_at']
    search_fields = ['member__user__first_name', 'member__user__last_name']
    ordering = ['-created_at']
    readonly_fields = ['created_at']


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    """News admin"""
    list_display = ['title', 'author', 'is_published', 'published_date', 'created_at']
    list_filter = ['is_published', 'published_date', 'created_at']
    search_fields = ['title', 'content', 'author__username']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    """FAQ admin"""
    list_display = ['question', 'category', 'order', 'is_active', 'created_at']
    list_filter = ['category', 'is_active', 'created_at']
    search_fields = ['question', 'answer']
    ordering = ['order', 'created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Download)
class DownloadAdmin(admin.ModelAdmin):
    """Download admin"""
    list_display = ['title', 'file_type', 'download_count', 'is_active', 'uploaded_by', 'created_at']
    list_filter = ['file_type', 'is_active', 'created_at']
    search_fields = ['title', 'description', 'uploaded_by__username']
    ordering = ['-created_at']
    readonly_fields = ['download_count', 'created_at', 'updated_at']


@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    """Gallery admin"""
    list_display = ['title', 'uploaded_by', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'description', 'uploaded_by__username']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    """Contact info admin"""
    list_display = ['branch', 'name', 'phone', 'email', 'is_active', 'created_at']
    list_filter = ['branch', 'is_active', 'created_at']
    search_fields = ['name', 'email', 'phone']
    ordering = ['branch', 'created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(CustomerFeedback)
class CustomerFeedbackAdmin(admin.ModelAdmin):
    """Customer feedback admin"""
    list_display = ['name', 'email', 'subject', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(SystemSetting)
class SystemSettingAdmin(admin.ModelAdmin):
    """System setting admin"""
    list_display = ['key', 'setting_type', 'is_active', 'created_at']
    list_filter = ['setting_type', 'is_active', 'created_at']
    search_fields = ['key', 'description']
    ordering = ['setting_type', 'key']
    readonly_fields = ['created_at', 'updated_at'] 