from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import News, FAQ, Download, Gallery, ContactInfo
from .serializers import NewsSerializer, FAQSerializer, DownloadSerializer, GallerySerializer, ContactInfoSerializer
from .views import IsAdminUser


class NewsViewSet(viewsets.ModelViewSet):
    """News management views"""
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_published', 'author']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'published_date']
    
    def get_permissions(self):
        """Allow public access to published news"""
        if self.action == 'published':
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=False, methods=['get'])
    def published(self, request):
        """Get only published news"""
        news = News.objects.filter(is_published=True).order_by('-published_date')
        serializer = self.get_serializer(news, many=True)
        return Response(serializer.data)


class FAQViewSet(viewsets.ModelViewSet):
    """FAQ management views"""
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['question', 'answer']
    ordering_fields = ['order', 'created_at']
    
    def get_permissions(self):
        """Allow public access to active FAQs"""
        if self.action == 'active':
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get only active FAQs"""
        faqs = FAQ.objects.filter(is_active=True).order_by('order', 'created_at')
        serializer = self.get_serializer(faqs, many=True)
        return Response(serializer.data)


class DownloadViewSet(viewsets.ModelViewSet):
    """Download management views"""
    queryset = Download.objects.all()
    serializer_class = DownloadSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['file_type', 'is_active']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'download_count']
    
    def get_permissions(self):
        """Allow public access to active downloads"""
        if self.action == 'active':
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get only active downloads"""
        downloads = Download.objects.filter(is_active=True).order_by('-created_at')
        serializer = self.get_serializer(downloads, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def increment_download(self, request, pk=None):
        """Increment download count"""
        download = self.get_object()
        download.download_count += 1
        download.save()
        return Response({'message': 'Download count updated'})


class GalleryViewSet(viewsets.ModelViewSet):
    """Gallery management views"""
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'uploaded_by']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at']
    
    def get_permissions(self):
        """Allow public access to active gallery items"""
        if self.action == 'active':
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get only active gallery items"""
        gallery = Gallery.objects.filter(is_active=True).order_by('-created_at')
        serializer = self.get_serializer(gallery, many=True)
        return Response(serializer.data)


class ContactInfoViewSet(viewsets.ModelViewSet):
    """Contact info management views"""
    queryset = ContactInfo.objects.all()
    serializer_class = ContactInfoSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['branch', 'is_active']
    search_fields = ['name', 'email', 'phone']
    ordering_fields = ['created_at']
    
    def get_permissions(self):
        """Allow public access to active contact info"""
        if self.action == 'active':
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get only active contact info"""
        contacts = ContactInfo.objects.filter(is_active=True).order_by('branch')
        serializer = self.get_serializer(contacts, many=True)
        return Response(serializer.data) 