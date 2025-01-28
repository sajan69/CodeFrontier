import time
import logging
from django.db import connection
from django.core.cache import cache
from django.conf import settings

logger = logging.getLogger(__name__)

class RequestTimingMiddleware:
    """Middleware to log request timing and database query information."""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Start timing
        start_time = time.time()
        
        # Process the request
        response = self.get_response(request)
        
        # Calculate duration
        duration = time.time() - start_time
        
        # Get query information
        query_count = len(connection.queries)
        queries_time = sum(float(q.get('time', 0)) for q in connection.queries)
        
        # Log the information
        logger.info(
            f'Path: {request.path} - '
            f'Method: {request.method} - '
            f'Duration: {duration:.2f}s - '
            f'Queries: {query_count} - '
            f'Query Time: {queries_time:.2f}s'
        )
        
        # Add timing header in debug mode
        if settings.DEBUG:
            response['X-Page-Generation-Duration-ms'] = int(duration * 1000)
            response['X-Query-Count'] = query_count
        
        return response

class CacheMiddleware:
    """Middleware to handle cache control headers."""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Add cache control headers
        if request.method == 'GET' and not request.path.startswith('/admin/'):
            response['Cache-Control'] = f'max-age={settings.CACHE_TTL}'
        else:
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response['Pragma'] = 'no-cache'
            response['Expires'] = '0'
        
        return response

class SecurityHeadersMiddleware:
    """Middleware to add security headers to responses."""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Add security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response['Permissions-Policy'] = 'geolocation=(), microphone=()'
        
        if not settings.DEBUG:
            response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        
        return response

class QueryDebugMiddleware:
    """Middleware to log detailed query information in debug mode."""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Clear queries at the start of request
        if settings.DEBUG:
            connection.queries = []
        
        response = self.get_response(request)
        
        # Log queries in debug mode
        if settings.DEBUG and not request.path.startswith('/admin/'):
            total_time = 0
            for query in connection.queries:
                total_time += float(query.get('time', 0))
                logger.debug(f"\nQuery: {query.get('sql', '')}\n"
                           f"Time: {query.get('time', 0)}s")
            
            logger.debug(f"\nTotal Queries: {len(connection.queries)}\n"
                        f"Total Time: {total_time:.2f}s")
        
        return response 