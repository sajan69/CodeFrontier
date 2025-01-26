from django.contrib import admin
from .models import Project, Category, Task, Comment, UserProfile,OTPVerification

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'created_at')
    list_filter = ('owner', 'created_at')
    search_fields = ('name', 'description', 'owner__username')
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ('members',)
    date_hierarchy = 'created_at'

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'project', 'color')
    list_filter = ('project',)
    search_fields = ('name', 'project__name')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'category', 'assignee', 'status', 'priority', 'due_date', 'is_overdue')
    list_filter = ('status', 'priority', 'project', 'category')
    search_fields = ('title', 'description', 'assignee__username', 'project__name')
    raw_id_fields = ('assignee', 'project', 'category')
    filter_horizontal = ('dependencies',)
    date_hierarchy = 'due_date'
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'project', 'category')
        }),
        ('Assignment', {
            'fields': ('assignee', 'status', 'priority', 'due_date')
        }),
        ('Dependencies', {
            'fields': ('dependencies',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('task', 'author', 'created_at')
    list_filter = ('task__project', 'author')
    search_fields = ('content', 'task__title', 'author__username')
    raw_id_fields = ('task', 'author')
    date_hierarchy = 'created_at'

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'bio', 'avatar')
    search_fields = ('user__username', 'phone', 'bio')
    raw_id_fields = ('user',)


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'otp', 'created_at')
    search_fields = ('user__username', 'otp')
    raw_id_fields = ('user',)
    date_hierarchy = 'created_at'
