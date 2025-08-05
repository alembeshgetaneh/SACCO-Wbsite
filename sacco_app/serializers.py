from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import (
    User, Member, SavingsAccount, Loan, Transaction, Share, 
    Dividend, DividendPayment, News, FAQ, Download, Gallery, 
    ContactInfo, CustomerFeedback, SystemSetting
)


class UserSerializer(serializers.ModelSerializer):
    """User serializer for general operations"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 
                 'phone_number', 'address', 'date_of_birth', 'profile_picture', 
                 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """User registration serializer"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 
                 'last_name', 'role', 'phone_number', 'address', 'date_of_birth']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """Login serializer"""
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include username and password')
        
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    """Change password serializer"""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs


class MemberSerializer(serializers.ModelSerializer):
    """Member serializer"""
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Member
        fields = '__all__'
        read_only_fields = ['member_id', 'created_at', 'updated_at']


class SavingsAccountSerializer(serializers.ModelSerializer):
    """Savings account serializer"""
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    
    class Meta:
        model = SavingsAccount
        fields = '__all__'
        read_only_fields = ['account_number', 'created_at', 'updated_at']


class LoanSerializer(serializers.ModelSerializer):
    """Loan serializer"""
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    
    class Meta:
        model = Loan
        fields = '__all__'
        read_only_fields = ['loan_number', 'application_date', 'created_at', 'updated_at']


class TransactionSerializer(serializers.ModelSerializer):
    """Transaction serializer"""
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['transaction_id', 'created_at']


class ShareSerializer(serializers.ModelSerializer):
    """Share serializer"""
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    
    class Meta:
        model = Share
        fields = '__all__'
        read_only_fields = ['share_number', 'purchase_date', 'created_at', 'updated_at']


class DividendSerializer(serializers.ModelSerializer):
    """Dividend serializer"""
    class Meta:
        model = Dividend
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class DividendPaymentSerializer(serializers.ModelSerializer):
    """Dividend payment serializer"""
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    dividend_year = serializers.IntegerField(source='dividend.year', read_only=True)
    
    class Meta:
        model = DividendPayment
        fields = '__all__'
        read_only_fields = ['created_at']


class NewsSerializer(serializers.ModelSerializer):
    """News serializer"""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    
    class Meta:
        model = News
        fields = '__all__'
        read_only_fields = ['author', 'created_at', 'updated_at']


class FAQSerializer(serializers.ModelSerializer):
    """FAQ serializer"""
    class Meta:
        model = FAQ
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class DownloadSerializer(serializers.ModelSerializer):
    """Download serializer"""
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Download
        fields = '__all__'
        read_only_fields = ['uploaded_by', 'download_count', 'created_at', 'updated_at']
    
    def get_file_url(self, obj):
        if obj.file:
            return self.context['request'].build_absolute_uri(obj.file.url)
        return None


class GallerySerializer(serializers.ModelSerializer):
    """Gallery serializer"""
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Gallery
        fields = '__all__'
        read_only_fields = ['uploaded_by', 'created_at', 'updated_at']
    
    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None


class ContactInfoSerializer(serializers.ModelSerializer):
    """Contact info serializer"""
    class Meta:
        model = ContactInfo
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class CustomerFeedbackSerializer(serializers.ModelSerializer):
    """Customer feedback serializer"""
    responded_by_name = serializers.CharField(source='responded_by.get_full_name', read_only=True)
    
    class Meta:
        model = CustomerFeedback
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class SystemSettingSerializer(serializers.ModelSerializer):
    """System setting serializer"""
    class Meta:
        model = SystemSetting
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class DashboardStatsSerializer(serializers.Serializer):
    """Dashboard statistics serializer"""
    total_news = serializers.IntegerField()
    total_faqs = serializers.IntegerField()
    total_downloads = serializers.IntegerField()
    total_gallery = serializers.IntegerField()
    new_feedback_count = serializers.IntegerField()
    total_feedback = serializers.IntegerField()
    published_news = serializers.IntegerField()
    active_faqs = serializers.IntegerField()
    active_downloads = serializers.IntegerField()
    active_gallery = serializers.IntegerField() 