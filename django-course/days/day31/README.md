# Day 31: Production Deployment

## Overview
Day 31 focuses on deploying our TaskFlow application to production using Vercel, implementing CI/CD with GitHub Actions, and setting up cloud storage with Cloudinary. We'll also configure PostgreSQL for production use and implement various security measures.

## Key Concepts Covered
- Production settings configuration
- Vercel deployment setup
- CI/CD pipeline with GitHub Actions
- Cloudinary media storage integration
- PostgreSQL database configuration
- Security best practices

## Required Packages
```txt
django-cloudinary-storage==0.3.0
cloudinary==1.33.0
dj-database-url==2.0.0
psycopg2-binary==2.9.9
python-decouple==3.8
whitenoise==6.8.0
gunicorn==21.2.0
```

## Setup Instructions

### 1. Environment Variables
Create a `.env` file with:
```plaintext
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=postgres://user:pass@host:5432/dbname
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
ALLOWED_HOSTS=.vercel.app,your-domain.com
```

### 2. Vercel Setup
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Create vercel.json:
```json
{
    "version": 2,
    "builds": [
        {
            "src": "taskflow/wsgi.py",
            "use": "@vercel/python",
            "config": { "maxLambdaSize": "15mb", "runtime": "python3.9" }
        },
        {
            "src": "build_files.sh",
            "use": "@vercel/static-build",
            "config": {
                "distDir": "staticfiles"
            }
        }
    ],
    "routes": [
        {
            "src": "/static/(.*)",
            "dest": "/static/$1"
        },
        {
            "src": "/(.*)",
            "dest": "taskflow/wsgi.py"
        }
    ]
}
```

### 3. GitHub Actions Setup
Create `.github/workflows/django.yml`:
```yaml
name: Django CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.9'
    - name: Install Dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    - name: Run Tests
      run: |
        python manage.py test
    - name: Run Coverage
      run: |
        coverage run manage.py test
        coverage report

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID}}
        vercel-project-id: ${{ secrets.PROJECT_ID}}
        vercel-args: '--prod'
```

## Key Files Created/Modified
- `settings/base.py`: Common settings
- `settings/development.py`: Development settings
- `settings/production.py`: Production settings
- `vercel.json`: Vercel configuration
- `build_files.sh`: Build script
- `.github/workflows/django.yml`: CI/CD configuration

## Deployment Steps
1. Set up PostgreSQL database (Supabase/Railway)
2. Configure Cloudinary account
3. Set up Vercel project
4. Configure GitHub repository secrets
5. Push code to trigger deployment

## Security Checklist
- [ ] Debug mode disabled
- [ ] Secret key secured
- [ ] HTTPS enforced
- [ ] Secure cookie settings
- [ ] CORS configured
- [ ] Database credentials secured
- [ ] Static files properly served
- [ ] Media files on Cloudinary
- [ ] Error logging configured
- [ ] Rate limiting implemented

## Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Cloudinary Django Integration](https://cloudinary.com/documentation/django_integration)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## What's Next?
After completing this deployment module, consider exploring:
- Docker containerization
- Kubernetes orchestration
- Microservices architecture
- Advanced monitoring and logging
- Performance optimization techniques 