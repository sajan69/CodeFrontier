# Day 26: Django Views & Templates

## Overview
Day 26 focuses on implementing views and templates for our TaskFlow project. We create both function-based and class-based views, set up templates with Bootstrap, and implement user authentication.

## Key Concepts Covered
- Function-based vs Class-based views
- Template inheritance and organization
- Authentication and authorization
- Form handling in views
- Static files and media management

## Code Examples

### Class-Based Views
```python
# tasks/views.py
from django.views.generic import ListView, DetailView, CreateView
from django.contrib.auth.mixins import LoginRequiredMixin

class ProjectListView(LoginRequiredMixin, ListView):
    model = Project
    template_name = 'tasks/project_list.html'
    context_object_name = 'projects'

    def get_queryset(self):
        return Project.objects.filter(
            models.Q(owner=self.request.user) |
            models.Q(members=self.request.user)
        ).distinct()
```

### Function-Based Views
```python
@login_required
def task_detail(request, project_slug, task_id):
    task = get_object_or_404(Task, id=task_id, project__slug=project_slug)
    if request.method == 'POST':
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            form.save()
            messages.success(request, 'Task updated successfully!')
            return redirect('tasks:project-detail', slug=project_slug)
    else:
        form = TaskForm(instance=task)
    
    return render(request, 'tasks/task_detail.html', {
        'task': task,
        'form': form,
    })
```

### Template Structure
```html
<!-- templates/base.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}TaskFlow{% endblock %}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    {% block extra_css %}{% endblock %}
</head>
<body>
    {% include 'includes/navbar.html' %}
    <div class="container mt-4">
        {% block content %}{% endblock %}
    </div>
    {% block extra_js %}{% endblock %}
</body>
</html>
```

## Setup Instructions

1. Create template directories:
```bash
mkdir templates/tasks templates/includes
```

2. Add template files:
```bash
touch templates/base.html
touch templates/includes/navbar.html
touch templates/tasks/project_list.html
touch templates/tasks/project_detail.html
```

3. Configure URLs:
```python
# tasks/urls.py
urlpatterns = [
    path('', views.ProjectListView.as_view(), name='project-list'),
    path('create/', views.ProjectCreateView.as_view(), name='project-create'),
    path('<slug:slug>/', views.ProjectDetailView.as_view(), name='project-detail'),
]
```

## Key Files Created/Modified
- `tasks/views.py`: View implementations
- `tasks/urls.py`: URL configurations
- `templates/base.html`: Base template
- `templates/tasks/*.html`: Task-specific templates
- `templates/includes/navbar.html`: Navigation component

## Challenges and Solutions
1. **Authentication Integration**
   - Solution: Used LoginRequiredMixin for class-based views
   - Added login_required decorator for function views

2. **Template Organization**
   - Solution: Implemented template inheritance
   - Created reusable template components

3. **View Logic**
   - Solution: Used CBVs for CRUD operations
   - Implemented FBVs for complex logic

## Resources
- [Django Views Documentation](https://docs.djangoproject.com/en/stable/topics/class-based-views/)
- [Django Templates](https://docs.djangoproject.com/en/stable/topics/templates/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [Django Authentication](https://docs.djangoproject.com/en/stable/topics/auth/)

## What's Next?
Day 27 will focus on Django Forms, where we'll:
- Create model forms
- Implement custom validation
- Handle file uploads
- Add CSRF protection
- Create form wizards 