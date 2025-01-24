from django import forms
from .models import Project, Task, Category

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

class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'description', 'category', 'assignee', 
                 'status', 'priority', 'due_date', 'dependencies']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
            'due_date': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
            'dependencies': forms.SelectMultiple(attrs={'class': 'form-select'}),
        }

    def __init__(self, *args, **kwargs):
        project = kwargs.pop('project', None)  # Extract project from kwargs
        super().__init__(*args, **kwargs)
        
        for field in self.fields.values():
            field.widget.attrs.update({'class': 'form-control'})
    
        # Filter dependencies and categories based on the project
        if project:
            self.fields['dependencies'].queryset = Task.objects.filter(project=project)
            self.fields['category'].queryset = Category.objects.filter(project=project)

    def clean(self):
        cleaned_data = super().clean()
        dependencies = cleaned_data.get('dependencies')
        
        # Check for circular dependencies
        if dependencies:
            for dep in dependencies:
                if self.instance in dep.dependencies.all():
                    raise forms.ValidationError(
                        f"Circular dependency detected with task: {dep.title}"
                    )
        
        return cleaned_data 