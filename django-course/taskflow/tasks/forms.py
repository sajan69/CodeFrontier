from django import forms
from .models import Project, Task, Category, Comment
from django.utils import timezone

class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['name', 'description', 'members']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
            'members': forms.SelectMultiple(attrs={'class': 'form-select'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs.update({'class': 'form-control'})

class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'description', 'color']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
            'color': forms.TextInput(attrs={'type': 'color'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs.update({'class': 'form-control'})

    def clean_color(self):
        color = self.cleaned_data.get('color')
        if not color.startswith('#'):
            raise forms.ValidationError("Color must be a valid hex code starting with #")
        return color

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        widgets = {
            'content': forms.Textarea(attrs={
                'rows': 3,
                'placeholder': 'Write your comment here...'
            }),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs.update({'class': 'form-control'})

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
            'attachment': forms.FileInput(attrs={'class': 'form-control', 'accept': '.pdf,.doc,.docx,.txt,.zip'}),
        }

    def __init__(self, *args, **kwargs):
        project = kwargs.pop('project', None)
        super().__init__(*args, **kwargs)
        
        # Add Bootstrap classes
        for field in self.fields.values():
            if not isinstance(field.widget, (forms.FileInput, forms.SelectMultiple)):
                field.widget.attrs.update({'class': 'form-control'})
        
        # Filter querysets based on project
        if project:
            self.fields['category'].queryset = project.categories.all()
            self.fields['assignee'].queryset = project.members.all()
            self.fields['dependencies'].queryset = project.tasks.exclude(
                id=self.instance.id if self.instance else None
            )

    def clean_attachment(self):
        attachment = self.cleaned_data.get('attachment')
        if attachment:
            # Check file size (5MB limit)
            if attachment.size > 5 * 1024 * 1024:
                raise forms.ValidationError("File size cannot exceed 5MB")
            
            # Check file extension
            allowed_extensions = ['.pdf', '.doc', '.docx', '.txt', '.zip']
            ext = attachment.name.lower()[-4:]
            if not any(ext.endswith(x) for x in allowed_extensions):
                raise forms.ValidationError(
                    "Only PDF, DOC, DOCX, TXT, and ZIP files are allowed"
                )
        return attachment

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