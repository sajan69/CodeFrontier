from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.db import models
from django.http import JsonResponse
from .models import Project, Task, Category, Comment
from .forms import ProjectForm, TaskForm, CategoryForm, CommentForm
from django.contrib.auth import logout

class ProjectListView(LoginRequiredMixin, ListView):
    model = Project
    template_name = 'tasks/project_list.html'
    context_object_name = 'projects'

    def get_queryset(self):
        queryset = Project.objects.filter(
            models.Q(owner=self.request.user) |
            models.Q(members=self.request.user)
        ).distinct()
        
        search_query = self.request.GET.get('q')
        if search_query:
            queryset = queryset.filter(
                models.Q(name__icontains=search_query) |
                models.Q(description__icontains=search_query)
            )
        return queryset

class ProjectDetailView(LoginRequiredMixin, DetailView):
    model = Project
    template_name = 'tasks/project_detail.html'
    context_object_name = 'project'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        tasks = self.object.tasks.all()
        
        # Filter tasks
        status = self.request.GET.get('status')
        priority = self.request.GET.get('priority')
        
        if status:
            tasks = tasks.filter(status=status)
        if priority:
            tasks = tasks.filter(priority=priority)
            
        context['tasks'] = tasks
        context['status_choices'] = Task.STATUS_CHOICES
        context['priority_choices'] = Task.PRIORITY_CHOICES
        return context

class ProjectCreateView(LoginRequiredMixin, CreateView):
    model = Project
    form_class = ProjectForm
    template_name = 'tasks/project_form.html'
    success_url = reverse_lazy('tasks:project-list')

    def form_valid(self, form):
        form.instance.owner = self.request.user
        response = super().form_valid(form)
        messages.success(self.request, 'Project created successfully!')
        return response

class ProjectUpdateView(LoginRequiredMixin, UpdateView):
    model = Project
    form_class = ProjectForm
    template_name = 'tasks/project_form.html'

    def get_success_url(self):
        return reverse_lazy('tasks:project-detail', kwargs={'slug': self.object.slug})

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, 'Project updated successfully!')
        return response

class ProjectDeleteView(LoginRequiredMixin, DeleteView):
    model = Project
    template_name = 'tasks/project_confirm_delete.html'
    success_url = reverse_lazy('tasks:project-list')

    def delete(self, request, *args, **kwargs):
        messages.success(self.request, 'Project deleted successfully!')
        return super().delete(request, *args, **kwargs)

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

@login_required
def task_create(request, project_slug):
    project = get_object_or_404(Project, slug=project_slug)
    print(project)
    if request.method == 'POST':
        form = TaskForm(request.POST, request.FILES, project=project)
        if form.is_valid():
            task = form.save(commit=False)
            task.project = project
            task.save()
            messages.success(request, 'Task created successfully!')
            return redirect('tasks:project-detail', slug=project_slug)
    else:
        form = TaskForm(project=project)
    
    return render(request, 'tasks/task_form.html', {
        'form': form,
        'project': project,
    })

@login_required
def task_status_update(request, task_id):
    if request.method == 'POST' and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        task = get_object_or_404(Task, id=task_id)
        status = request.POST.get('status')
        if status in dict(Task.STATUS_CHOICES):
            task.status = status
            task.save()
            return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)

@login_required
def task_delete(request, project_slug, task_id):
    task = get_object_or_404(Task, id=task_id, project__slug=project_slug)
    if request.method == 'POST':
        task.delete()
        messages.success(request, 'Task deleted successfully!')
        return redirect('tasks:project-detail', slug=project_slug)
    
    return render(request, 'tasks/task_confirm_delete.html', {
        'task': task,
    })

@login_required
def logout_view(request):
    logout(request)
    return redirect('tasks:project-list')

@login_required
def category_list(request, project_slug):
    project = get_object_or_404(Project, slug=project_slug)
    if request.method == 'POST':
        form = CategoryForm(request.POST)
        if form.is_valid():
            category = form.save(commit=False)
            category.project = project
            category.save()
            messages.success(request, 'Category created successfully.')
            return redirect('tasks:category-list', project_slug=project.slug)
    else:
        form = CategoryForm()
    
    categories = Category.objects.filter(project=project)
    return render(request, 'tasks/category_list.html', {
        'project': project,
        'categories': categories,
        'form': form
    })

@login_required
def category_edit(request, project_slug, category_id):
    project = get_object_or_404(Project, slug=project_slug)
    category = get_object_or_404(Category, id=category_id, project=project)
    
    if request.method == 'POST':
        form = CategoryForm(request.POST, instance=category)
        if form.is_valid():
            form.save()
            messages.success(request, 'Category updated successfully.')
            return redirect('tasks:category-list', project_slug=project.slug)
    else:
        form = CategoryForm(instance=category)
    
    return render(request, 'tasks/category_edit.html', {
        'project': project,
        'category': category,
        'form': form
    })

@login_required
def category_delete(request, project_slug, category_id):
    project = get_object_or_404(Project, slug=project_slug)
    category = get_object_or_404(Category, id=category_id, project=project)
    
    if request.method == 'POST':
        category.delete()
        messages.success(request, 'Category deleted successfully.')
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)

@login_required
def task_comments(request, project_slug, task_id):
    project = get_object_or_404(Project, slug=project_slug)
    task = get_object_or_404(Task, id=task_id, project=project)
    
    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.task = task
            comment.author = request.user
            comment.save()
            messages.success(request, 'Comment added successfully.')
            return redirect('tasks:task-comments', project_slug=project.slug, task_id=task.id)
    else:
        form = CommentForm()
    
    comments = Comment.objects.filter(task=task).order_by('-created_at')
    return render(request, 'tasks/task_comments.html', {
        'task': task,
        'comments': comments,
        'form': form
    })

@login_required
def comment_delete(request, project_slug, task_id, comment_id):
    project = get_object_or_404(Project, slug=project_slug)
    task = get_object_or_404(Task, id=task_id, project=project)
    comment = get_object_or_404(Comment, id=comment_id, task=task)
    
    if request.user != comment.author and request.user != project.owner:
        messages.error(request, 'You do not have permission to delete this comment.')
        return redirect('tasks:task-comments', project_slug=project.slug, task_id=task.id)
    
    if request.method == 'POST':
        comment.delete()
        messages.success(request, 'Comment deleted successfully.')
        return redirect('tasks:task-comments', project_slug=project.slug, task_id=task.id)
    return redirect('tasks:task-comments', project_slug=project.slug, task_id=task.id)