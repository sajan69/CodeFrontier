from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import ValidationError
from tasks.models import Project, Task, Category, Comment, UserProfile
from datetime import timedelta

class ProjectModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        self.project = Project.objects.create(
            name='Test Project',
            description='Test Description',
            owner=self.user
        )

    def test_project_creation(self):
        self.assertEqual(self.project.name, 'Test Project')
        self.assertEqual(self.project.owner, self.user)
        self.assertEqual(self.project.slug, 'test-project')

    def test_project_str_representation(self):
        self.assertEqual(str(self.project), 'Test Project')

    def test_project_absolute_url(self):
        self.assertEqual(
            self.project.get_absolute_url(),
            f'/projects/{self.project.slug}/'
        )

class TaskModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
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
            assignee=self.user,
            status='todo',
            priority=2
        )

    def test_task_creation(self):
        self.assertEqual(self.task.title, 'Test Task')
        self.assertEqual(self.task.project, self.project)
        self.assertEqual(self.task.category, self.category)
        self.assertEqual(self.task.assignee, self.user)

    def test_task_str_representation(self):
        self.assertEqual(str(self.task), 'Test Task')

    def test_task_is_overdue(self):
        # Task without due date
        self.assertFalse(self.task.is_overdue)

        # Task with future due date
        self.task.due_date = timezone.now() + timedelta(days=1)
        self.task.save()
        self.assertFalse(self.task.is_overdue)

        # Task with past due date
        self.task.due_date = timezone.now() - timedelta(days=1)
        self.task.save()
        self.assertTrue(self.task.is_overdue)

        # Completed task with past due date
        self.task.status = 'done'
        self.task.save()
        self.assertFalse(self.task.is_overdue)

    def test_task_clean_validation(self):
        # Test past due date validation
        self.task.due_date = timezone.now() - timedelta(days=1)
        with self.assertRaises(ValidationError):
            self.task.clean()

        # Test completed task without assignee validation
        self.task.due_date = None
        self.task.status = 'done'
        self.task.assignee = None
        with self.assertRaises(ValidationError):
            self.task.clean()

class CategoryModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.project = Project.objects.create(
            name='Test Project',
            owner=self.user
        )
        self.category = Category.objects.create(
            name='Test Category',
            project=self.project,
            color='#007bff'
        )

    def test_category_creation(self):
        self.assertEqual(self.category.name, 'Test Category')
        self.assertEqual(self.category.project, self.project)
        self.assertEqual(self.category.color, '#007bff')

    def test_category_str_representation(self):
        self.assertEqual(
            str(self.category),
            'Test Project - Test Category'
        )

    def test_category_color_validation(self):
        # Test invalid color format
        self.category.color = 'invalid-color'
        with self.assertRaises(ValidationError):
            self.category.clean()

        # Test valid color format
        self.category.color = '#ff0000'
        self.category.clean()  # Should not raise ValidationError

class CommentModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
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

    def test_comment_creation(self):
        self.assertEqual(self.comment.content, 'Test Comment')
        self.assertEqual(self.comment.author, self.user)
        self.assertEqual(self.comment.task, self.task)

    def test_comment_str_representation(self):
        self.assertEqual(
            str(self.comment),
            'Comment by testuser on Test Task'
        )

class UserProfileModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        self.profile = UserProfile.objects.create(
            user=self.user,
            phone='1234567890',
            bio='Test Bio'
        )

    def test_profile_creation(self):
        self.assertEqual(self.profile.user, self.user)
        self.assertEqual(self.profile.phone, '1234567890')
        self.assertEqual(self.profile.bio, 'Test Bio')

    def test_profile_str_representation(self):
        self.assertEqual(
            str(self.profile),
            'Profile of testuser'
        ) 