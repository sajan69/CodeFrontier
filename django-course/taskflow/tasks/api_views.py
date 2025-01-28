from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Project, Task, Category, Comment, UserProfile
from .serializers import (
    ProjectSerializer, TaskSerializer, CategorySerializer,
    CommentSerializer, UserSerializer, UserProfileSerializer
)

class IsProjectMemberOrOwner(permissions.BasePermission):
    """
    Custom permission to only allow project members or owners to access the project.
    """
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Project):
            return request.user == obj.owner or request.user in obj.members.all()
        elif isinstance(obj, (Task, Category)):
            return request.user == obj.project.owner or request.user in obj.project.members.all()
        elif isinstance(obj, Comment):
            return request.user == obj.task.project.owner or request.user in obj.task.project.members.all()
        return False

class ProjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing projects.
    """
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsProjectMemberOrOwner]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at', 'updated_at']

    @swagger_auto_schema(
        operation_description="List all projects accessible to the authenticated user",
        responses={200: ProjectSerializer(many=True)}
    )
    def get_queryset(self):
        return Project.objects.filter(
            Q(owner=self.request.user) | Q(members=self.request.user)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class TaskViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing tasks within a project.
    """
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsProjectMemberOrOwner]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['due_date', 'priority', 'status', 'created_at']

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        return Task.objects.filter(project_id=project_id)

    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs['project_id'])
        if project.owner == self.request.user or self.request.user in project.members.all():
            serializer.save(project=project)

class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing categories within a project.
    """
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsProjectMemberOrOwner]

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        return Category.objects.filter(project_id=project_id)

    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs['project_id'])
        if project.owner == self.request.user or self.request.user in project.members.all():
            serializer.save(project=project)

class CommentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing task comments.
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsProjectMemberOrOwner]

    def get_queryset(self):
        task_id = self.kwargs['task_id']
        return Comment.objects.filter(task_id=task_id)

    def perform_create(self, serializer):
        task = get_object_or_404(Task, id=self.kwargs['task_id'])
        if task.project.owner == self.request.user or self.request.user in task.project.members.all():
            serializer.save(author=self.request.user, task=task)

class UserProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing user profiles.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    @swagger_auto_schema(
        operation_description="Get the current user's profile",
        responses={200: UserProfileSerializer()}
    )
    @action(detail=False, methods=['get'])
    def me(self, request):
        profile = get_object_or_404(UserProfile, user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data) 