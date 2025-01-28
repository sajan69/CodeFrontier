"""
URL configuration for taskflow project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from tasks.api_views import (
    ProjectViewSet, TaskViewSet, CategoryViewSet,
    CommentViewSet, UserProfileViewSet
)

# API Router
router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='api-project')
router.register(r'profiles', UserProfileViewSet, basename='api-profile')

# Swagger Schema View
schema_view = get_schema_view(
    openapi.Info(
        title="TaskFlow API",
        default_version='v1',
        description="API documentation for TaskFlow project management system",
        terms_of_service="https://www.taskflow.com/terms/",
        contact=openapi.Contact(email="contact@taskflow.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.IsAuthenticated,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('tasks.urls')),
    
    # API URLs
    path('api/', include([
        path('', include(router.urls)),
        path('projects/<int:project_id>/tasks/', TaskViewSet.as_view({
            'get': 'list',
            'post': 'create'
        }), name='project-tasks-list'),
        path('projects/<int:project_id>/tasks/<int:pk>/', TaskViewSet.as_view({
            'get': 'retrieve',
            'put': 'update',
            'patch': 'partial_update',
            'delete': 'destroy'
        }), name='project-tasks-detail'),
        path('projects/<int:project_id>/categories/', CategoryViewSet.as_view({
            'get': 'list',
            'post': 'create'
        }), name='project-categories-list'),
        path('projects/<int:project_id>/categories/<int:pk>/', CategoryViewSet.as_view({
            'get': 'retrieve',
            'put': 'update',
            'patch': 'partial_update',
            'delete': 'destroy'
        }), name='project-categories-detail'),
        path('projects/<int:project_id>/tasks/<int:task_id>/comments/', CommentViewSet.as_view({
            'get': 'list',
            'post': 'create'
        }), name='task-comments-list'),
        path('projects/<int:project_id>/tasks/<int:task_id>/comments/<int:pk>/', CommentViewSet.as_view({
            'get': 'retrieve',
            'put': 'update',
            'patch': 'partial_update',
            'delete': 'destroy'
        }), name='task-comments-detail'),
    ])),
    path('api-auth/', include('rest_framework.urls')),
    
    # Swagger URLs
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
