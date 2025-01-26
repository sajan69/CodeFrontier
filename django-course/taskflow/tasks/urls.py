from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView

app_name = 'tasks'

urlpatterns = [
    # Project URLs
    path('', views.ProjectListView.as_view(), name='project-list'),
    path('projects/create/', views.ProjectCreateView.as_view(), name='project-create'),
    path('projects/<slug:slug>/', views.ProjectDetailView.as_view(), name='project-detail'),
    path('projects/<slug:slug>/edit/', views.ProjectUpdateView.as_view(), name='project-update'),
    path('projects/<slug:slug>/delete/', views.ProjectDeleteView.as_view(), name='project-delete'),
    
     #Task URLs
    path('<slug:project_slug>/tasks/create/', views.task_create, name='task-create'),
    path('<slug:project_slug>/tasks/<int:task_id>/', views.task_detail, name='task-detail'),
    path('<slug:project_slug>/tasks/<int:task_id>/delete/', views.task_delete, name='task-delete'),
    path('tasks/<int:task_id>/status/', views.task_status_update, name='task-status-update'),
    path('<slug:project_slug>/tasks/<int:task_id>/comments/', views.task_comments, name='task-comments'),
    path('<slug:project_slug>/tasks/<int:task_id>/comments/<int:comment_id>/delete/', views.comment_delete, name='comment-delete'),
    
    # Category URLs
    path('projects/<slug:project_slug>/categories/', views.category_list, name='category-list'),
    path('projects/<slug:project_slug>/categories/<int:category_id>/edit/', views.category_edit, name='category-edit'),
    path('projects/<slug:project_slug>/categories/<int:category_id>/delete/', views.category_delete, name='category-delete'),
    
    # Authentication URLs
    path('register/', views.register, name='register'),
    path('verify-otp/', views.verify_otp, name='verify_otp'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('verify-reset-otp/', views.verify_reset_otp, name='verify_reset_otp'),
    path('reset-password/', views.reset_password, name='reset_password'),
    path('change-password/', views.change_password, name='change_password'),
    path('profile/', views.profile, name='profile'),
    path('resend-otp/', views.resend_otp, name='resend_otp'),
] 