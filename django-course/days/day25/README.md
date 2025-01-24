# Day 25: Django Data Modeling & Database Design

## Overview
Day 25 focuses on designing and implementing the database schema for our TaskFlow project using Django's ORM. We create models for projects, tasks, categories, and implement relationships between them.

## Key Concepts Covered
- Database schema design and relationships
- Django model creation and customization
- Admin interface configuration
- Model managers and custom querysets
- Data validation and clean methods

## Code Examples

### Core Models
```python
# tasks/models.py
from django.db import models
from django.contrib.auth.models import User

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Project(TimeStampedModel):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    slug = models.SlugField(unique=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    members = models.ManyToManyField(User, related_name='projects')

class Task(TimeStampedModel):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    assignee = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    priority = models.IntegerField(choices=PRIORITY_CHOICES)
```

### Admin Configuration
```python
# tasks/admin.py
from django.contrib import admin
from .models import Project, Task

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'assignee', 'status')
    list_filter = ('status', 'priority', 'project')
    search_fields = ('title', 'description')
```

## Setup Instructions

1. Create the models:
```bash
python manage.py makemigrations
```

2. Apply migrations:
```bash
python manage.py migrate
```

3. Create a superuser:
```bash
python manage.py createsuperuser
```

4. Run the development server:
```bash
python manage.py runserver
```

## Key Files Created/Modified
- `tasks/models.py`: Core data models
- `tasks/admin.py`: Admin interface configuration
- Database migrations files
- Custom model managers and querysets

## Challenges and Solutions
1. **Complex Relationships**
   - Solution: Used appropriate field types (ForeignKey, ManyToManyField)
   - Implemented related_name for reverse relationships

2. **Data Validation**
   - Solution: Added clean() methods
   - Implemented custom validation logic

3. **Query Optimization**
   - Solution: Created custom model managers
   - Added select_related() and prefetch_related()

## Resources
- [Django Model Field Reference](https://docs.djangoproject.com/en/stable/ref/models/fields/)
- [Django Admin Site](https://docs.djangoproject.com/en/stable/ref/contrib/admin/)
- [Making Queries](https://docs.djangoproject.com/en/stable/topics/db/queries/)
- [Model Relationships](https://docs.djangoproject.com/en/stable/topics/db/examples/)

## What's Next?
Day 26 will focus on Django Views, where we'll:
- Create function-based and class-based views
- Implement CRUD operations
- Set up templates and static files
- Handle forms and user input
- Add authentication views 