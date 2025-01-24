from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.text import slugify
from django.core.exceptions import ValidationError

class TimeStampedModel(models.Model):
    """
    An abstract base class model that provides self-updating
    created_at and updated_at fields.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Project(TimeStampedModel):
    """
    Project model representing a collection of tasks.
    """
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    slug = models.SlugField(unique=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_projects')
    members = models.ManyToManyField(User, related_name='member_projects')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return f"/projects/{self.slug}/"

class Category(TimeStampedModel):
    """
    Category model for organizing tasks within a project.
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#007bff')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='categories')

    class Meta:
        verbose_name_plural = 'Categories'
        unique_together = ['name', 'project']

    def __str__(self):
        return f"{self.project.name} - {self.name}"

    def clean(self):
        if self.color and not self.color.startswith('#'):
            raise ValidationError({'color': 'Color must be a valid hex code starting with #'})

class TaskQuerySet(models.QuerySet):
    def overdue(self):
        return self.filter(due_date__lt=timezone.now(), status__ne='done')

    def high_priority(self):
        return self.filter(priority__gte=3)

    def for_user(self, user):
        return self.filter(models.Q(assignee=user) | models.Q(project__owner=user) | models.Q(project__members=user))

class TaskManager(models.Manager):
    def get_queryset(self):
        return TaskQuerySet(self.model, using=self._db)

    def overdue(self):
        return self.get_queryset().overdue()

    def high_priority(self):
        return self.get_queryset().high_priority()

    def for_user(self, user):
        return self.get_queryset().for_user(user)

class Task(TimeStampedModel):
    """
    Task model representing individual tasks within a project.
    """
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('review', 'In Review'),
        ('done', 'Done'),
    ]
    PRIORITY_CHOICES = [
        (1, 'Low'),
        (2, 'Medium'),
        (3, 'High'),
        (4, 'Urgent'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    assignee = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tasks')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    priority = models.IntegerField(choices=PRIORITY_CHOICES, default=2)
    due_date = models.DateTimeField(null=True, blank=True)
    dependencies = models.ManyToManyField('self', symmetrical=False, related_name='dependent_tasks', blank=True)

    objects = TaskManager()

    def __str__(self):
        return self.title

    def clean(self):
        if self.due_date and self.due_date < timezone.now():
            raise ValidationError({'due_date': 'Due date cannot be in the past'})
        
        if self.status == 'done' and not self.assignee:
            raise ValidationError({'assignee': 'Completed tasks must have an assignee'})

    @property
    def is_overdue(self):
        if self.due_date and self.status != 'done':
            return self.due_date < timezone.now()
        return False

    def can_start(self):
        return all(dep.status == 'done' for dep in self.dependencies.all())

    def get_absolute_url(self):
        return f"/projects/{self.project.slug}/tasks/{self.id}/"

class Comment(TimeStampedModel):
    """
    Comment model for task discussions.
    """
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='task_comments')
    content = models.TextField()

    def __str__(self):
        return f"Comment by {self.author.username} on {self.task.title}"
