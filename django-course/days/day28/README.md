# Day 28: Django Authentication & OTP Verification

## Overview
Day 28 focuses on implementing a secure authentication system in our TaskFlow project using Django's authentication framework enhanced with OTP (One-Time Password) email verification. We create a complete user management system with registration, login, password reset, and profile management.

## Key Concepts Covered
- User registration with email verification
- OTP-based authentication
- Password reset and change functionality
- User profile management
- Session handling and security
- Email configuration and templates

## Code Examples

### OTP Model
```python
class OTPVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_verified = models.BooleanField(default=False)

    def generate_otp(self):
        self.otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        self.expires_at = timezone.now() + timezone.timedelta(minutes=10)
        self.save()
        return self.otp
```

### Authentication Views
```python
def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False
            user.save()
            
            # Generate and send OTP
            otp_obj = OTPVerification.objects.create(user=user)
            otp = otp_obj.generate_otp()
            
            # Send verification email
            send_verification_email(user, otp)
            return redirect('tasks:verify_otp')
    else:
        form = UserRegistrationForm()
    return render(request, 'auth/register.html', {'form': form})
```

### Email Configuration
```python
# settings.py
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = config('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')
```

## Setup Instructions

1. Add email configuration to `.env`:
```
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

2. Create OTP model and run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

3. Create authentication templates:
```bash
mkdir templates/auth
touch templates/auth/{login,register,verify_otp,profile}.html
```

4. Update URL patterns:
```python
path('login/', views.login_view, name='login'),
path('register/', views.register, name='register'),
path('logout/', views.logout_user, name='logout'),
path('profile/', views.profile, name='profile'),
path('forgot-password/', views.forgot_password, name='forgot_password'),
path('change-password/', views.change_password, name='change_password'),
path('send-otp/', views.send_otp, name='send_otp'),
path('resend-otp/', views.resend_otp, name='resend_otp'),
path('verify-otp/', views.verify_otp, name='verify_otp'),
```

## Key Files Created/Modified
- `tasks/models.py`: Added OTP and UserProfile models
- `tasks/views.py`: Authentication views
- `tasks/forms.py`: Authentication forms
- `templates/auth/*.html`: Authentication templates
- `settings.py`: Email and session configuration
- `middleware.py`: Session management middleware

## Challenges and Solutions
1. **Email Configuration**
   - Solution: Used environment variables for sensitive data
   - Implemented proper email templates
   - Added error handling for email sending

2. **OTP Security**
   - Solution: Added expiration time
   - Implemented one-time use
   - Added rate limiting for OTP generation

3. **Session Management**
   - Solution: Added session timeout
   - Implemented concurrent login control
   - Added secure session settings

## Resources
- [Django Authentication Documentation](https://docs.djangoproject.com/en/stable/topics/auth/)
- [Django Email Documentation](https://docs.djangoproject.com/en/stable/topics/email/)
- [Django Sessions Documentation](https://docs.djangoproject.com/en/stable/topics/http/sessions/)
- [Two-Factor Authentication Best Practices](https://www.twilio.com/blog/2fa-python-django)

## What's Next?
Day 29 will focus on Django REST Framework, where we'll:
- Create RESTful APIs for our models
- Implement API authentication
- Add request/response serialization
- Handle API permissions
- Create API documentation 