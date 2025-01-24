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
    
    # Task URLs
    path('<slug:project_slug>/tasks/create/', views.task_create, name='task-create'),
    path('<slug:project_slug>/tasks/<int:task_id>/', views.task_detail, name='task-detail'),
    path('<slug:project_slug>/tasks/<int:task_id>/delete/', views.task_delete, name='task-delete'),
    path('tasks/<int:task_id>/status/', views.task_status_update, name='task-status-update'),
] 