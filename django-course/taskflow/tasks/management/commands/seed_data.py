# tasks/management/commands/seed_data.py
import json
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.utils.text import slugify
from django.utils import timezone
from tasks.models import Project, Category, Task, UserProfile, Comment

class Command(BaseCommand):
    help = 'Seed the database with initial data'

    def add_arguments(self, parser):
        parser.add_argument('--file', type=str, help='Path to JSON seed file')

    def handle(self, *args, **options):
        file_path = options.get('file') or 'tasks/management/seed_data.json'
        
        try:
            with open(file_path, 'r') as file:
                seed_data = json.load(file)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'Seed file not found: {file_path}'))
            return

        # Create users and their profiles
        users = {}
        for user_data in seed_data.get('users', []):
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data.get('email', ''),
                    'first_name': user_data.get('first_name', ''),
                    'last_name': user_data.get('last_name', '')
                }
            )
            user.set_password(user_data.get('password', 'defaultpassword'))
            user.save()
            users[user_data['username']] = user

            # Create or update user profile
            profile_data = user_data.get('profile', {})
            UserProfile.objects.update_or_create(
                user=user,
                defaults={
                    'phone': profile_data.get('phone', ''),
                    'bio': profile_data.get('bio', '')
                }
            )

        # Create projects
        projects = {}
        for project_data in seed_data.get('projects', []):
            owner = users.get(project_data['owner'])
            if not owner:
                self.stdout.write(self.style.WARNING(f"Owner not found for project: {project_data['name']}"))
                continue

            project, created = Project.objects.get_or_create(
                name=project_data['name'],
                defaults={
                    'description': project_data.get('description', ''),
                    'owner': owner,
                    'slug': slugify(project_data['name'])
                }
            )
            
            # Add members
            for member_username in project_data.get('members', []):
                member = users.get(member_username)
                if member:
                    project.members.add(member)
            
            projects[project_data['name']] = project

        # Create categories
        categories = {}
        for category_data in seed_data.get('categories', []):
            project = projects.get(category_data['project'])
            if not project:
                self.stdout.write(self.style.WARNING(f"Project not found for category: {category_data['name']}"))
                continue

            category, created = Category.objects.get_or_create(
                name=category_data['name'],
                project=project,
                defaults={
                    'description': category_data.get('description', ''),
                    'color': category_data.get('color', '#007bff')
                }
            )
            categories[category_data['name']] = category

        # Create tasks and comments
        tasks = {}
        for task_data in seed_data.get('tasks', []):
            project = projects.get(task_data['project'])
            if not project:
                self.stdout.write(self.style.WARNING(f"Project not found for task: {task_data['title']}"))
                continue

            assignee = users.get(task_data.get('assignee'))
            category = categories.get(task_data.get('category'))

            task, created = Task.objects.get_or_create(
                title=task_data['title'],
                project=project,
                defaults={
                    'description': task_data.get('description', ''),
                    'assignee': assignee,
                    'category': category,
                    'status': task_data.get('status', 'todo'),
                    'priority': task_data.get('priority', 2),
                    'due_date': task_data.get('due_date')
                }
            )
            tasks[task_data['title']] = task

            # Create comments
            for comment_data in task_data.get('comments', []):
                author = users.get(comment_data['author'])
                if author:
                    Comment.objects.get_or_create(
                        task=task,
                        author=author,
                        content=comment_data['content'],
                        defaults={
                            'created_at': timezone.now()
                        }
                    )

            # Handle task dependencies
            if task_data.get('dependencies'):
                for dep_title in task_data['dependencies']:
                    dep_task = tasks.get(dep_title)
                    if dep_task:
                        task.dependencies.add(dep_task)

        self.stdout.write(self.style.SUCCESS('Successfully seeded database'))