from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.db import models
from django.http import JsonResponse
from .models import OTPVerification, Project, Task, Category, Comment, UserProfile
from .forms import   PasswordResetNewForm, ProjectForm, TaskForm, CategoryForm, CommentForm, UserRegistrationForm, LoginForm, PasswordResetForm, UserProfileForm
from django.contrib.auth import logout
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import login
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.models import User
from django.utils import timezone

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
    return redirect('tasks:login')

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

def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False
            user.save()
            
            # Create user profile
            UserProfile.objects.create(user=user)
            
            # Create OTPVerification object with expires_at set
            otp_obj = OTPVerification.objects.create(
                user=user,
                expires_at=timezone.now() + timezone.timedelta(minutes=10)
            )
            otp = otp_obj.generate_otp()
            
            # Send verification email
            subject = 'Verify your TaskFlow account'
            html_message = render_to_string('auth/email/verification_email.html', {
                'user': user,
                'otp': otp,
            })
            send_mail(
                subject, 
                message='', 
                from_email=None, 
                recipient_list=[user.email],
                html_message=html_message
                )
            
            request.session['registration_user_id'] = user.id
            messages.success(request, 'Registration successful! Please check your email for verification OTP.')
            return redirect('tasks:verify_otp')
    else:
        form = UserRegistrationForm()
    return render(request, 'auth/register.html', {'form': form})

def verify_otp(request):
    if request.session.get('registration_user_id'):
        user_id = request.session.get('registration_user_id')
        if not user_id:
            messages.error(request, 'Invalid session. Please register again.')
            return redirect('tasks:register')
        
        if request.method == 'POST':
            otp = request.POST.get('otp')
            try:
                verification = OTPVerification.objects.get(
                    user_id=user_id,
                    otp=otp,
                    is_verified=False
                )
                if verification.is_valid():
                    verification.is_verified = True
                    verification.save()
                    
                    user = verification.user
                    user.is_active = True
                    user.save()
                    
                    login(request, user)
                    del request.session['registration_user_id']
                    messages.success(request, 'Account verified successfully!')
                    return redirect('tasks:project-list')
                else:
                    messages.error(request, 'OTP has expired. Please register again.')
                    return redirect('tasks:register')
            except OTPVerification.DoesNotExist:
                messages.error(request, 'Invalid OTP')
    else:
        #implement for reste password otp verification view
        if request.session.get('reset_user_id'):
            user_id = request.session.get('reset_user_id')
            if not user_id:
                messages.error(request, 'Invalid session. Please try resetting your password again.')
                return redirect('tasks:forgot_password')
            
            if request.method == 'POST':
                otp = request.POST.get('otp')
                try:
                    verification = OTPVerification.objects.get(
                        user_id=user_id,
                        otp=otp,
                        is_verified=False
                    )
                    if verification.is_valid():
                        verification.is_verified = True
                        verification.save()
                        messages.success(request, 'OTP verified. Please set your new password.')
                        return redirect('tasks:reset_password')
                    else:
                        messages.error(request, 'OTP has expired. Please try again.')
                        return redirect('tasks:forgot_password')
                except OTPVerification.DoesNotExist:
                    messages.error(request, 'Invalid OTP')
        else:
            messages.error(request, 'Invalid session. Please try again.')
            return redirect('tasks:forgot_password')
    return render(request, 'auth/verify_otp.html')

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, 'Login successful!')
            return redirect('tasks:project-list')
    else:
        form = LoginForm()
    return render(request, 'auth/login.html', {'form': form})

def forgot_password(request):
    if request.method == 'POST':
        form = PasswordResetForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            user = User.objects.get(email=email)
            
            # Generate and send reset OTP
            otp_obj = OTPVerification.objects.create(
                user=user,
                expires_at=timezone.now() + timezone.timedelta(minutes=10)
            )
            otp = otp_obj.generate_otp()
            
            subject = 'Reset your TaskFlow password'
            html_message = render_to_string('auth/email/reset_password_email.html', {
                'user': user,
                'otp': otp,
            })
            send_mail(
                subject, 
                message='', 
                from_email=None, 
                recipient_list=[email],
                html_message=html_message
                )
            
            request.session['reset_user_id'] = user.id
            messages.success(request, 'Please check your email for password reset OTP.')
            return redirect('tasks:verify_reset_otp')
    else:
        form = PasswordResetForm()
    return render(request, 'auth/forgot_password.html', {'form': form})

def verify_reset_otp(request):
    user_id = request.session.get('reset_user_id')
    if not user_id:
        messages.error(request, 'Invalid session. Please try resetting your password again.')
        return redirect('tasks:forgot_password')
    
    if request.method == 'POST':
        otp = request.POST.get('otp')
        try:
            verification = OTPVerification.objects.get(
                user_id=user_id,
                otp=otp,
                is_verified=False
            )
            if verification.is_valid():
                verification.is_verified = True
                verification.save()
                messages.success(request, 'OTP verified. Please set your new password.')
                return redirect('tasks:reset_password')
            else:
                messages.error(request, 'OTP has expired. Please try again.')
                return redirect('tasks:forgot_password')
        except OTPVerification.DoesNotExist:
            messages.error(request, 'Invalid OTP')
    return render(request, 'auth/verify_otp.html')

def reset_password(request):
    user_id = request.session.get('reset_user_id')
    if not user_id:
        messages.error(request, 'Invalid session. Please try resetting your password again.')
        return redirect('tasks:forgot_password')
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        messages.error(request, 'Invalid user. Please try again.')
        return redirect('tasks:forgot_password')
    
    if request.method == 'POST':
        form = PasswordResetNewForm(request.POST)
        if form.is_valid():
            user.set_password(form.cleaned_data['new_password1'])
            user.save()
            del request.session['reset_user_id']
            messages.success(request, 'Your password has been reset successfully. Please login with your new password.')
            return redirect('tasks:login')
    else:
        form = PasswordResetNewForm()
    return render(request, 'auth/reset_password_confrim.html', {'form': form})

@login_required
def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Your password was successfully updated!')
            return redirect('tasks:profile')
    else:
        form = PasswordChangeForm(request.user)
    return render(request, 'auth/reset_password_confrim.html', {'form': form})

@login_required
def profile(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST, request.FILES, instance=request.user.profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully!')
            return redirect('tasks:profile')
    else:
        form = UserProfileForm(instance=request.user.profile)
    return render(request, 'auth/profile.html', {'form': form})

def resend_otp(request):
    user_id = request.session.get('registration_user_id') or request.session.get('reset_user_id')
    if not user_id:
        messages.error(request, 'Invalid session. Please try again.')
        return redirect('tasks:register')
    
    try:
        user = User.objects.get(id=user_id)
        # Generate and send new OTP
        otp_obj = OTPVerification.objects.create(
            user=user,
            expires_at=timezone.now() + timezone.timedelta(minutes=10)
        )
        otp = otp_obj.generate_otp()
        
        subject = 'Your new TaskFlow OTP'
        html_message = render_to_string('auth/email/resend_otp_email.html', {
            'user': user,
            'otp': otp,
        })
        send_mail(
            subject, 
            message='', 
            from_email=None, 
            recipient_list=[user.email],
            html_message=html_message
            )
        
        messages.success(request, 'New OTP has been sent to your email.')
    except User.DoesNotExist:
        messages.error(request, 'Invalid user. Please try again.')
    
    return redirect('tasks:verify_otp')