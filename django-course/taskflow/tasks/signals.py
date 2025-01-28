from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.mail import send_mail
from django.core.cache import cache
from django.conf import settings
from django.utils import timezone
from .models import Task, Comment, Project
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Task)
def notify_task_assignment(sender, instance, created, **kwargs):
    """Send email notification when a task is assigned to a user."""
    try:
        if created and instance.assignee:
            send_mail(
                subject=f'New Task Assignment: {instance.title}',
                message=f'''
                You have been assigned to the task: {instance.title}
                Project: {instance.project.name}
                Due Date: {instance.due_date or 'No due date'}
                Priority: {instance.get_priority_display()}
                ''',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[instance.assignee.email],
            )
            logger.info(f'Task assignment notification sent to {instance.assignee.email}')
    except Exception as e:
        logger.error(f'Failed to send task assignment notification: {str(e)}')

@receiver(post_save, sender=Comment)
def notify_task_comment(sender, instance, created, **kwargs):
    """Send email notification when a comment is added to a task."""
    try:
        if created:
            task = instance.task
            # Get unique recipients (task assignee and project owner)
            recipients = list(set(filter(None, [
                task.assignee.email if task.assignee else None,
                task.project.owner.email
            ])))
            
            if recipients:
                send_mail(
                    subject=f'New Comment on Task: {task.title}',
                    message=f'''
                    New comment by {instance.author.username}:
                    
                    {instance.content}
                    
                    Task: {task.title}
                    Project: {task.project.name}
                    ''',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=recipients,
                )
                logger.info(f'Comment notification sent to {", ".join(recipients)}')
    except Exception as e:
        logger.error(f'Failed to send comment notification: {str(e)}')

@receiver(post_save, sender=Project)
def clear_project_cache(sender, instance, **kwargs):
    """Clear cache when a project is updated."""
    try:
        # Clear project-specific cache
        cache.delete(f'project_{instance.id}')
        # Clear user's projects cache
        cache.delete(f'user_projects_{instance.owner.id}')
        for member in instance.members.all():
            cache.delete(f'user_projects_{member.id}')
        logger.info(f'Cache cleared for project {instance.id}')
    except Exception as e:
        logger.error(f'Failed to clear project cache: {str(e)}')

@receiver(post_save, sender=Task)
def check_overdue_tasks(sender, instance, **kwargs):
    """Check and notify about overdue tasks."""
    try:
        if instance.due_date and instance.status != 'done':
            if instance.due_date < timezone.now():
                recipients = list(set(filter(None, [
                    instance.assignee.email if instance.assignee else None,
                    instance.project.owner.email
                ])))
                
                if recipients:
                    send_mail(
                        subject=f'Task Overdue: {instance.title}',
                        message=f'''
                        The following task is overdue:
                        
                        Task: {instance.title}
                        Project: {instance.project.name}
                        Due Date: {instance.due_date}
                        Status: {instance.get_status_display()}
                        ''',
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=recipients,
                    )
                    logger.info(f'Overdue task notification sent for task {instance.id}')
    except Exception as e:
        logger.error(f'Failed to send overdue task notification: {str(e)}') 