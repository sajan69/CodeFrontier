export class ErrorTracker {
  static init() {
    window.addEventListener('error', this.handleError);
    window.addEventListener('unhandledrejection', this.handlePromiseError);
  }

  static handleError(event) {
    const error = {
      message: event.message,
      stack: event.error?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Send to your error tracking service
    console.error('Tracked Error:', error);
  }

  static handlePromiseError(event) {
    const error = {
      message: event.reason?.message || 'Promise rejection',
      stack: event.reason?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    console.error('Tracked Promise Error:', error);
  }
} 