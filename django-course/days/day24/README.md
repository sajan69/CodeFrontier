# Day 24: Django Project Setup & Foundation

## Overview
Day 24 focuses on setting up a modern Django project with proper structure, security configurations, and API documentation. We've created TaskFlow, a task management system that will demonstrate Django 5.0's capabilities.

## Key Concepts Covered
- Project structure and organization
- Environment variable configuration
- Django REST Framework integration
- Swagger/OpenAPI documentation
- Security best practices
- Static and media file handling

## Code Examples

### Project Structure
```
taskflow/
├── manage.py
├── requirements.txt
├── .env
├── taskflow/
│   ├── settings.py
│   ├── urls.py
│   └── ...
├── tasks/
├── templates/
├── static/
├── media/
└── staticfiles/
```

### Environment Configuration (.env)
```python
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

### Dependencies (requirements.txt)
```python
Django>=5.0.1
python-dotenv>=1.0.0
djangorestframework>=3.14.0
drf-yasg>=1.21.7
django-cors-headers>=4.3.1
Pillow>=10.1.0
python-decouple>=3.8
whitenoise>=6.6.0
```

### REST Framework Configuration (settings.py)
```python
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],
}
```

### Swagger Documentation Setup (urls.py)
```python
schema_view = get_schema_view(
    openapi.Info(
        title="TaskFlow API",
        default_version='v1',
        description="Task Management System API",
        terms_of_service="https://www.taskflow.com/terms/",
        contact=openapi.Contact(email="contact@taskflow.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('tasks.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0)),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0)),
]
```

## Setup Instructions

1. Clone the repository and navigate to the project:
```bash
cd taskflow
```

2. Create and activate virtual environment:
```bash
python -m venv env
env\Scripts\activate  # Windows
source env/bin/activate  # Unix/MacOS
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
- Create `.env` file in project root
- Add required environment variables

5. Run migrations:
```bash
python manage.py migrate
```

6. Start development server:
```bash
python manage.py runserver
```

## Key Files Created/Modified
- `taskflow/settings.py`: Project settings and configurations
- `taskflow/urls.py`: URL routing and Swagger setup
- `tasks/urls.py`: App-specific URL patterns
- `.env`: Environment variables
- `requirements.txt`: Project dependencies
- Project structure directories (templates, static, media)

## Challenges and Solutions
1. **Environment Management**
   - Solution: Implemented python-dotenv for secure configuration
   
2. **API Documentation**
   - Solution: Integrated drf-yasg for Swagger/OpenAPI docs
   
3. **Security**
   - Solution: Configured proper authentication and permission classes
   - Separated sensitive data into environment variables

## Resources
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [drf-yasg Documentation](https://drf-yasg.readthedocs.io/)
- [12 Factor App](https://12factor.net/)

## What's Next?
Day 25 will focus on data modeling, where we'll:
- Design the database schema
- Create models for Projects, Tasks, and Categories
- Set up model relationships
- Implement the Django admin interface
- Create initial migrations 