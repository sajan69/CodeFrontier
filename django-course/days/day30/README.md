# Day 30: Advanced Django Features

## Overview
Day 30 focuses on implementing advanced Django features to enhance our TaskFlow project's performance, maintainability, and reliability. We cover caching with Redis, custom signals for notifications, management commands, middleware, and comprehensive testing.

## Key Concepts Covered
- Redis caching implementation
- Custom signals for notifications
- Custom management commands
- Request timing middleware
- Unit and API testing

## Code Examples

### Redis Cache Configuration
```python
# settings.py
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}

CACHE_TTL = 60 * 15  # 15 minutes
```

### Custom Signals
```python
# tasks/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=Task)
def notify_task_assignment(sender, instance, created, **kwargs):
    if created and instance.assignee:
        send_mail(
            subject=f'New Task Assignment: {instance.title}',
            message=f'You have been assigned to the task: {instance.title}',
            from_email='noreply@taskflow.com',
            recipient_list=[instance.assignee.email],
        )
```

### Custom Management Command
```python
# tasks/management/commands/generate_report.py
class Command(BaseCommand):
    help = 'Generate project status report'

    def add_arguments(self, parser):
        parser.add_argument('project_id', type=int)
        parser.add_argument('--output', type=str)

    def handle(self, *args, **options):
        project = Project.objects.get(id=options['project_id'])
        # Generate report logic here
```

## Setup Instructions

1. Install Redis:
```bash
# Windows
Download and install from https://redis.io/download

# Linux
sudo apt-get install redis-server

# MacOS
brew install redis
```

2. Install required packages:
```bash
pip install django-redis redis coverage
```

3. Configure Redis in settings.py:
```python
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

4. Run tests:
```bash
python manage.py test
coverage run manage.py test
coverage report
```

## Key Files Created/Modified
- `tasks/signals.py`: Custom signals implementation
- `tasks/middleware.py`: Request timing middleware
- `tasks/management/commands/`: Custom management commands
- `tasks/tests/`: Test files
- `settings.py`: Cache configuration

## Challenges and Solutions
1. **Redis Integration**
   - Solution: Proper configuration in settings.py
   - Cache key management
   - Cache invalidation strategy

2. **Signal Handling**
   - Solution: Implemented signal receivers
   - Added error handling
   - Managed circular imports

3. **Testing**
   - Solution: Created comprehensive test cases
   - Used proper test fixtures
   - Implemented API tests

## Resources
- [Django Caching](https://docs.djangoproject.com/en/stable/topics/cache/)
- [Django Signals](https://docs.djangoproject.com/en/stable/topics/signals/)
- [Django Testing](https://docs.djangoproject.com/en/stable/topics/testing/)
- [Redis Documentation](https://redis.io/documentation)

## What's Next?
Day 31 will focus on Production Deployment, where we'll:
- Configure production settings
- Set up CI/CD pipeline
- Implement monitoring
- Configure security settings
- Deploy to a production server

## Terminal Commands
```bash
# Install Redis (Ubuntu)
sudo apt-get update
sudo apt-get install redis-server

# Start Redis
sudo service redis-server start

# Install Python packages
pip install django-redis redis coverage

# Run tests
python manage.py test
coverage run manage.py test
coverage report

# Generate project report
python manage.py generate_report 1 --output=report.csv

# Start Redis CLI
redis-cli

# Clear Redis cache
redis-cli flushall
``` 