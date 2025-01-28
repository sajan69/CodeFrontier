# Day 29: Building RESTful APIs with Django REST Framework

## Overview
Day 29 focuses on transforming our TaskFlow project into a modern API-driven application using Django REST Framework (DRF). We implement RESTful APIs with nested routing, proper serialization, and comprehensive documentation using Swagger/OpenAPI.

## Key Concepts Covered
- RESTful API design with nested routing
- Serializers with nested relationships
- ViewSets and custom permissions
- API documentation with Swagger/OpenAPI
- Search, filtering, and ordering capabilities

## Code Examples

### Nested Routing
```python
# taskflow/urls.py
urlpatterns = [
    path('api/', include([
        path('projects/<int:project_id>/tasks/',
             TaskViewSet.as_view({'get': 'list', 'post': 'create'})),
        path('projects/<int:project_id>/categories/',
             CategoryViewSet.as_view({'get': 'list', 'post': 'create'})),
        path('projects/<int:project_id>/tasks/<int:task_id>/comments/',
             CommentViewSet.as_view({'get': 'list', 'post': 'create'})),
    ])),
]
```

### Custom Permissions
```python
class IsProjectMemberOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Project):
            return request.user == obj.owner or request.user in obj.members.all()
        elif isinstance(obj, (Task, Category)):
            return request.user == obj.project.owner or request.user in obj.project.members.all()
        return False
```

### API Documentation
```python
schema_view = get_schema_view(
    openapi.Info(
        title="TaskFlow API",
        default_version='v1',
        description="API documentation for TaskFlow project management system",
        contact=openapi.Contact(email="contact@taskflow.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.IsAuthenticated,),
)
```

## Setup Instructions

1. Install required packages:
```bash
pip install djangorestframework drf-yasg django-filter
```

2. Add DRF to INSTALLED_APPS:
```python
INSTALLED_APPS = [
    ...
    'rest_framework',
    'drf_yasg',
    'django_filters',
]
```

3. Configure REST Framework settings:
```python
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

## API Endpoints

### Projects
- `GET /api/projects/`: List all projects
- `POST /api/projects/`: Create new project
- `GET /api/projects/{id}/`: Get project details
- `PUT /api/projects/{id}/`: Update project
- `DELETE /api/projects/{id}/`: Delete project

### Tasks
- `GET /api/projects/{id}/tasks/`: List tasks in project
- `POST /api/projects/{id}/tasks/`: Create task in project
- `GET /api/projects/{id}/tasks/{task_id}/`: Get task details
- `PUT /api/projects/{id}/tasks/{task_id}/`: Update task
- `DELETE /api/projects/{id}/tasks/{task_id}/`: Delete task

### Categories
- `GET /api/projects/{id}/categories/`: List categories in project
- `POST /api/projects/{id}/categories/`: Create category in project
- `GET /api/projects/{id}/categories/{category_id}/`: Get category details
- `PUT /api/projects/{id}/categories/{category_id}/`: Update category
- `DELETE /api/projects/{id}/categories/{category_id}/`: Delete category

### Comments
- `GET /api/projects/{id}/tasks/{task_id}/comments/`: List comments on task
- `POST /api/projects/{id}/tasks/{task_id}/comments/`: Create comment on task
- `GET /api/projects/{id}/tasks/{task_id}/comments/{comment_id}/`: Get comment details
- `PUT /api/projects/{id}/tasks/{task_id}/comments/{comment_id}/`: Update comment
- `DELETE /api/projects/{id}/tasks/{task_id}/comments/{comment_id}/`: Delete comment

## Key Files Created/Modified
- `tasks/serializers.py`: Model serializers
- `tasks/api_views.py`: ViewSets and permissions
- `taskflow/urls.py`: API URL configuration
- `tasks/filters.py`: Custom API filters
- `settings.py`: DRF configuration

## Challenges and Solutions
1. **Nested Routing**
   - Solution: Used nested URL patterns
   - Implemented proper ViewSet methods
   - Added project/task validation

2. **Permissions**
   - Solution: Created custom permission class
   - Implemented object-level permissions
   - Added proper user validation

3. **Documentation**
   - Solution: Integrated Swagger/OpenAPI
   - Added proper descriptions
   - Implemented authentication in docs

## Resources
- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [DRF Nested Routers](https://github.com/alanjds/drf-nested-routers)
- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [REST API Best Practices](https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api)

## What's Next?
Day 30 will focus on Advanced Topics, where we'll:
- Implement caching strategies
- Implement Signals
- Implement Middleware
- Implement Custom Commands
- Implement Testing
