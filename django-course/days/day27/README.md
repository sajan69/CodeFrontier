# Day 27: Django Forms & Validation

## Overview
Day 27 focuses on Django's built-in forms framework, enhancing our TaskFlow project with robust form handling, validation, and file uploads. We explore model forms, custom validation, and form styling.

## Key Concepts Covered
- Django model forms and form fields
- Form validation and cleaning
- File upload handling
- Form styling with Bootstrap
- CSRF protection and security

## Code Examples

### Model Form Implementation
```python
# tasks/forms.py
class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = [
            'title', 'description', 'category', 'assignee',
            'status', 'priority', 'due_date', 'dependencies',
            'attachment'
        ]
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
            'due_date': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
            'dependencies': forms.SelectMultiple(attrs={'class': 'form-select'}),
        }
```

### Form Validation
```python
def clean_due_date(self):
    due_date = self.cleaned_data.get('due_date')
    if due_date and due_date < timezone.now():
        raise forms.ValidationError("Due date cannot be in the past")
    return due_date

def clean(self):
    cleaned_data = super().clean()
    status = cleaned_data.get('status')
    assignee = cleaned_data.get('assignee')
    
    if status == 'done' and not assignee:
        raise forms.ValidationError({
            'assignee': "Completed tasks must have an assignee"
        })
    
    return cleaned_data
```

### File Upload View
```python
@login_required
def task_create(request, project_slug):
    project = get_object_or_404(Project, slug=project_slug)
    if request.method == 'POST':
        form = TaskForm(request.POST, request.FILES, project=project)
        if form.is_valid():
            task = form.save(commit=False)
            task.project = project
            task.save()
            form.save_m2m()
            messages.success(request, 'Task created successfully!')
            return redirect('tasks:project-detail', slug=project_slug)
    else:
        form = TaskForm(project=project)
    
    return render(request, 'tasks/task_form.html', {
        'form': form,
        'project': project,
    })
```

## Setup Instructions

1. Update Task model:
```bash
python manage.py makemigrations
python manage.py migrate
```

2. Configure media settings:
```python
# settings.py
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

3. Update URLs for media serving:
```python
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

## Key Files Modified
- `tasks/models.py`: Added file attachment field
- `tasks/forms.py`: Enhanced form validation
- `tasks/views.py`: Updated file handling
- `templates/tasks/task_form.html`: Added file upload support
- `settings.py`: Media configuration

## Challenges and Solutions
1. **File Upload Handling**
   - Solution: Added proper enctype to forms
   - Configured media settings
   - Implemented secure file validation

2. **Form Validation**
   - Solution: Implemented clean methods
   - Added custom validation logic
   - Enhanced error messages

3. **Dynamic Form Fields**
   - Solution: Used form initialization
   - Filtered querysets based on project
   - Added custom widgets

## Resources
- [Django Forms Documentation](https://docs.djangoproject.com/en/stable/topics/forms/)
- [File Uploads in Django](https://docs.djangoproject.com/en/stable/topics/http/file-uploads/)
- [Form Field Validation](https://docs.djangoproject.com/en/stable/ref/forms/validation/)
- [Django CSRF Protection](https://docs.djangoproject.com/en/stable/ref/csrf/)

## What's Next?
Day 28 will focus on Django Authentication, where we'll:
- Implement user registration and login
- Add password reset functionality
- Create user profiles
- Set up email verification
- Implement social authentication 