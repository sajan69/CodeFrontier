# TaskFlow - Task Management System

A robust task management system built with Django 5.0 and Django REST Framework.

## Features (Planned)

- User Authentication and Authorization
- Project Management
- Task Creation and Assignment
- Task Categories and Labels
- Task Comments and Attachments
- RESTful API with Swagger Documentation
- Real-time Updates (Coming Soon)

## Tech Stack

- Django 5.0+
- Django REST Framework
- SQLite (Development)
- Swagger/OpenAPI Documentation
- Python-dotenv for Environment Variables
- CORS Headers for Frontend Integration

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd taskflow
```

2. Create and activate a virtual environment:
```bash
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a .env file in the project root and add your environment variables:
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Create a superuser:
```bash
python manage.py createsuperuser
```

7. Run the development server:
```bash
python manage.py runserver
```

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/swagger/
- ReDoc: http://localhost:8000/redoc/

## Project Structure

```
taskflow/
├── manage.py
├── requirements.txt
├── .env
├── taskflow/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── tasks/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
├── templates/
├── static/
├── media/
└── staticfiles/
```

## Development Guidelines

- Follow PEP 8 style guide
- Write tests for new features
- Document API endpoints
- Keep the README updated
- Use meaningful commit messages

## License

This project is licensed under the BSD License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 