from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
import os

from .models import (
    User, Member, SavingsAccount, Loan, Transaction, Share, 
    Dividend, DividendPayment, News, FAQ, Download, Gallery, 
    ContactInfo, CustomerFeedback, SystemSetting
)
from .serializers import (
    UserSerializer, UserRegistrationSerializer, LoginSerializer, ChangePasswordSerializer,
    MemberSerializer, SavingsAccountSerializer, LoanSerializer, TransactionSerializer,
    ShareSerializer, DividendSerializer, DividendPaymentSerializer, NewsSerializer,
    FAQSerializer, DownloadSerializer, GallerySerializer, ContactInfoSerializer,
    CustomerFeedbackSerializer, SystemSettingSerializer, DashboardStatsSerializer
)


class IsAdminUser(permissions.BasePermission):
    """Custom permission to only allow admin users"""
    def has_permission(self, request, view):
        return request.user and request.user.role in ['admin', 'manager']


class IsFinanceOfficer(permissions.BasePermission):
    """Custom permission to only allow finance officers and admins"""
    def has_permission(self, request, view):
        return request.user and request.user.role in ['admin', 'manager', 'finance_officer']


class AuthViewSet(viewsets.ViewSet):
    """Authentication views"""
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        """User registration"""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """User login"""
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            
            # Send email notification for admin logins
            if user.role in ['admin', 'manager']:
                try:
                    send_mail(
                        'Admin Login Notification',
                        f'Admin user {user.username} logged in at {timezone.now()}',
                        settings.DEFAULT_FROM_EMAIL,
                        [settings.DEFAULT_FROM_EMAIL],
                        fail_silently=True,
                    )
                except Exception as e:
                    print(f"Email notification failed: {e}")
            
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Change user password"""
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.validated_data['old_password']):
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                return Response({'message': 'Password changed successfully'})
            else:
                return Response({'error': 'Invalid old password'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        """User logout"""
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out successfully'})
        except Exception:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    """User management views"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'username']
    
    @action(detail=False, methods=['get'])
    def profile(self, request):
        """Get current user profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put'])
    def update_profile(self, request):
        """Update current user profile"""
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ShareViewSet(viewsets.ModelViewSet):
    """Share management views"""
    queryset = Share.objects.all()
    serializer_class = ShareSerializer
    permission_classes = [IsFinanceOfficer]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'member']
    search_fields = ['share_number', 'member__user__first_name', 'member__user__last_name']
    ordering_fields = ['created_at', 'total_value']


class DividendViewSet(viewsets.ModelViewSet):
    """Dividend management views"""
    queryset = Dividend.objects.all()
    serializer_class = DividendSerializer
    permission_classes = [IsFinanceOfficer]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['year', 'is_paid']
    ordering_fields = ['year', 'declaration_date']
    
    @action(detail=True, methods=['post'])
    def calculate_payments(self, request, pk=None):
        """Calculate dividend payments for all members"""
        dividend = self.get_object()
        
        # Get all active shares
        shares = Share.objects.filter(is_active=True)
        
        for share in shares:
            amount = share.quantity * dividend.amount_per_share
            DividendPayment.objects.get_or_create(
                dividend=dividend,
                member=share.member,
                defaults={
                    'shares_owned': share.quantity,
                    'amount': amount,
                }
            )
        
        return Response({'message': 'Dividend payments calculated successfully'})


class DividendPaymentViewSet(viewsets.ModelViewSet):
    """Dividend payment views"""
    queryset = DividendPayment.objects.all()
    serializer_class = DividendPaymentSerializer
    permission_classes = [IsFinanceOfficer]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['dividend', 'member', 'is_paid']
    ordering_fields = ['created_at', 'amount']


class CustomerFeedbackViewSet(viewsets.ModelViewSet):
    """Customer feedback views"""
    queryset = CustomerFeedback.objects.all()
    serializer_class = CustomerFeedbackSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['name', 'email', 'subject', 'message']
    ordering_fields = ['created_at', 'status']
    
    def get_permissions(self):
        """Allow public access to submit feedback"""
        if self.action == 'submit_feedback':
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    @action(detail=False, methods=['post'])
    def submit_feedback(self, request):
        """Submit new feedback (public endpoint)"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            feedback = serializer.save()
            
            # Send email notification to admin
            try:
                send_mail(
                    'New Customer Feedback',
                    f'New feedback from {feedback.name} ({feedback.email}):\n\nSubject: {feedback.subject}\nMessage: {feedback.message}',
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.DEFAULT_FROM_EMAIL],
                    fail_silently=True,
                )
                
                # Send confirmation email to customer
                send_mail(
                    'Feedback Received',
                    f'Thank you for your feedback. We have received your message and will respond shortly.\n\nSubject: {feedback.subject}\nMessage: {feedback.message}',
                    settings.DEFAULT_FROM_EMAIL,
                    [feedback.email],
                    fail_silently=True,
                )
            except Exception as e:
                print(f"Email notification failed: {e}")
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        """Respond to feedback"""
        feedback = self.get_object()
        response_text = request.data.get('response')
        
        if not response_text:
            return Response({'error': 'Response text is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        feedback.admin_response = response_text
        feedback.responded_by = request.user
        feedback.response_date = timezone.now()
        feedback.status = 'resolved'
        feedback.save()
        
        # Send response email to customer
        try:
            send_mail(
                'Response to Your Feedback',
                f'Thank you for your feedback. Here is our response:\n\n{response_text}',
                settings.DEFAULT_FROM_EMAIL,
                [feedback.email],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Email notification failed: {e}")
        
        return Response({'message': 'Response sent successfully'})


class SystemSettingViewSet(viewsets.ModelViewSet):
    """System settings views"""
    queryset = SystemSetting.objects.all()
    serializer_class = SystemSettingSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['setting_type', 'is_active']
    search_fields = ['key', 'description']
    ordering_fields = ['created_at']


class DashboardView(APIView):
    """Dashboard statistics view"""
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        """Get dashboard statistics"""
        today = timezone.now().date()
        
        stats = {
            'total_members': Member.objects.count(),
            'active_members': Member.objects.filter(status='active').count(),
            'total_savings': SavingsAccount.objects.aggregate(total=Sum('balance'))['total'] or 0,
            'total_loans': Loan.objects.filter(status='active').aggregate(total=Sum('remaining_balance'))['total'] or 0,
            'pending_loans': Loan.objects.filter(status='pending').count(),
            'total_transactions_today': Transaction.objects.filter(created_at__date=today).count(),
            'new_feedback_count': CustomerFeedback.objects.filter(status='new').count(),
            'total_shares': Share.objects.filter(is_active=True).aggregate(total=Sum('quantity'))['total'] or 0,
            'total_dividends': Dividend.objects.filter(is_paid=True).aggregate(total=Sum('total_amount'))['total'] or 0,
        }
        
        serializer = DashboardStatsSerializer(stats)
        return Response(serializer.data) 