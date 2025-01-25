from django.urls import path
from . import views

app_name = 'tasks'

urlpatterns = [
    path('logout/', views.logout_view, name='logout'),
    # Project URLs
    path('', views.ProjectListView.as_view(), name='project-list'),
    path('create/', views.ProjectCreateView.as_view(), name='project-create'),
    path('<slug:slug>/', views.ProjectDetailView.as_view(), name='project-detail'),
    path('<slug:slug>/edit/', views.ProjectUpdateView.as_view(), name='project-update'),
    path('<slug:slug>/delete/', views.ProjectDeleteView.as_view(), name='project-delete'),
    
    # Category URLs
    path('<slug:project_slug>/categories/', views.category_list, name='category-list'),
    path('<slug:project_slug>/categories/<int:category_id>/edit/', views.category_edit, name='category-edit'),
    path('<slug:project_slug>/categories/<int:category_id>/delete/', views.category_delete, name='category-delete'),
    
    # Task URLs
    path('<slug:project_slug>/tasks/create/', views.task_create, name='task-create'),
    path('<slug:project_slug>/tasks/<int:task_id>/', views.task_detail, name='task-detail'),
    path('<slug:project_slug>/tasks/<int:task_id>/delete/', views.task_delete, name='task-delete'),
    path('tasks/<int:task_id>/status/', views.task_status_update, name='task-status-update'),
    
    # Comment URLs
    path('<slug:project_slug>/tasks/<int:task_id>/comments/', views.task_comments, name='task-comments'),
    path('<slug:project_slug>/tasks/<int:task_id>/comments/<int:comment_id>/delete/', 
         views.comment_delete, name='comment-delete'),
] 