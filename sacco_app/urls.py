from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views, views_financial, views_content
from .models import Share, Dividend, DividendPayment, CustomerFeedback, SystemSetting
from .serializers import (
    ShareSerializer, DividendSerializer, DividendPaymentSerializer,
    CustomerFeedbackSerializer, SystemSettingSerializer
)

# Create router and register viewsets
router = DefaultRouter()

# Authentication and user management
router.register(r'auth', views.AuthViewSet, basename='auth')
router.register(r'users', views.UserViewSet)

# Financial management
router.register(r'members', views_financial.MemberViewSet)
router.register(r'savings-accounts', views_financial.SavingsAccountViewSet)
router.register(r'loans', views_financial.LoanViewSet)
router.register(r'transactions', views_financial.TransactionViewSet)

# Shares and dividends
router.register(r'shares', views.ShareViewSet)
router.register(r'dividends', views.DividendViewSet)
router.register(r'dividend-payments', views.DividendPaymentViewSet)

# Content management
router.register(r'news', views_content.NewsViewSet)
router.register(r'faqs', views_content.FAQViewSet)
router.register(r'downloads', views_content.DownloadViewSet)
router.register(r'gallery', views_content.GalleryViewSet)
router.register(r'contact-info', views_content.ContactInfoViewSet)

# Customer feedback and system settings
router.register(r'feedback', views.CustomerFeedbackViewSet)
router.register(r'settings', views.SystemSettingViewSet)

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Dashboard endpoint
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    
    # Public endpoints (no authentication required)
    path('public/news/', views_content.NewsViewSet.as_view({'get': 'published'}), name='public-news'),
    path('public/faqs/', views_content.FAQViewSet.as_view({'get': 'active'}), name='public-faqs'),
    path('public/downloads/', views_content.DownloadViewSet.as_view({'get': 'active'}), name='public-downloads'),
    path('public/gallery/', views_content.GalleryViewSet.as_view({'get': 'active'}), name='public-gallery'),
    path('public/contact-info/', views_content.ContactInfoViewSet.as_view({'get': 'active'}), name='public-contact-info'),
    path('public/feedback/submit/', views.CustomerFeedbackViewSet.as_view({'post': 'submit_feedback'}), name='submit-feedback'),
] 