from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from tasks.models import Project, Task, Category, Comment
from tasks.serializers import ProjectSerializer, TaskSerializer

class ProjectAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        self.client.force_authenticate(user=self.user)
        
        self.project = Project.objects.create(
            name='Test Project',
            description='Test Description',
            owner=self.user
        )

    def test_list_projects(self):
        url = reverse('api-project-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Test Project')

    def test_create_project(self):
        url = reverse('api-project-list')
        data = {
            'name': 'New Project',
            'description': 'New Description'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 2)
        self.assertEqual(Project.objects.get(name='New Project').owner, self.user)

    def test_retrieve_project(self):
        url = reverse('api-project-detail', args=[self.project.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Project')

    def test_update_project(self):
        url = reverse('api-project-detail', args=[self.project.id])
        data = {
            'name': 'Updated Project',
            'description': 'Updated Description'
        }
        response = self.client.put(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.project.refresh_from_db()
        self.assertEqual(self.project.name, 'Updated Project')

    def test_delete_project(self):
        url = reverse('api-project-detail', args=[self.project.id])
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Project.objects.count(), 0)

class TaskAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.project = Project.objects.create(
            name='Test Project',
            owner=self.user
        )
        self.category = Category.objects.create(
            name='Test Category',
            project=self.project
        )
        self.task = Task.objects.create(
            title='Test Task',
            project=self.project,
            category=self.category,
            assignee=self.user
        )

    def test_list_tasks(self):
        url = reverse('project-tasks-list', args=[self.project.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Task')

    def test_create_task(self):
        url = reverse('project-tasks-list', args=[self.project.id])
        data = {
            'title': 'New Task',
            'description': 'New Description',
            'category_id': self.category.id,
            'assignee_id': self.user.id
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 2)
        self.assertEqual(Task.objects.get(title='New Task').project, self.project)

    def test_retrieve_task(self):
        url = reverse('project-tasks-detail', args=[self.project.id, self.task.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Task')

    def test_update_task(self):
        url = reverse('project-tasks-detail', args=[self.project.id, self.task.id])
        data = {
            'title': 'Updated Task',
            'description': 'Updated Description',
            'category_id': self.category.id,
            'assignee_id': self.user.id
        }
        response = self.client.put(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.task.refresh_from_db()
        self.assertEqual(self.task.title, 'Updated Task')

    def test_delete_task(self):
        url = reverse('project-tasks-detail', args=[self.project.id, self.task.id])
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Task.objects.count(), 0)

class CommentAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.project = Project.objects.create(
            name='Test Project',
            owner=self.user
        )
        self.task = Task.objects.create(
            title='Test Task',
            project=self.project
        )
        self.comment = Comment.objects.create(
            task=self.task,
            author=self.user,
            content='Test Comment'
        )

    def test_list_comments(self):
        url = reverse('task-comments-list', args=[self.project.id, self.task.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['content'], 'Test Comment')

    def test_create_comment(self):
        url = reverse('task-comments-list', args=[self.project.id, self.task.id])
        data = {'content': 'New Comment'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 2)
        self.assertEqual(
            Comment.objects.get(content='New Comment').author,
            self.user
        )

    def test_delete_comment(self):
        url = reverse('task-comments-detail', args=[
            self.project.id,
            self.task.id,
            self.comment.id
        ])
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Comment.objects.count(), 0)