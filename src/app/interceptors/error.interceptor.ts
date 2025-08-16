import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Client Error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || 'Bad Request';
              break;
            case 401:
              errorMessage = 'Unauthorized access';
              // Only trigger logout for authenticated endpoints, not login/register
              if (this.shouldTriggerLogout(req.url)) {
                // Clear auth data locally (don't call logout API)
                this.clearAuthAndRedirect();
              }
              break;
            case 403:
              errorMessage = 'Access forbidden';
              break;
            case 404:
              errorMessage = 'Resource not found';
              break;
            case 422:
              // Validation errors
              if (error.error?.errors) {
                const validationErrors = error.error.errors;
                const firstErrorKey = Object.keys(validationErrors)[0];
                errorMessage = validationErrors[firstErrorKey]?.[0] || 'Validation error';
              } else {
                errorMessage = error.error?.message || 'Validation failed';
              }
              break;
            case 500:
              errorMessage = 'Internal server error';
              break;
            case 503:
              errorMessage = 'Service temporarily unavailable';
              break;
            default:
              errorMessage = error.error?.message || `Server Error: ${error.status}`;
          }
        }

        console.error('HTTP Error:', {
          status: error.status,
          message: errorMessage,
          url: error.url,
          error: error.error
        });

        return throwError(() => ({
          status: error.status,
          message: errorMessage,
          originalError: error
        }));
      })
    );
  }

  /**
   * Determine if a 401 error should trigger logout
   * Don't trigger logout for authentication endpoints
   */
  private shouldTriggerLogout(url: string): boolean {
    const authEndpoints = [
      '/api/login',
      '/api/register', 
      '/api/forgot-password',
      '/api/reset-password',
      '/api/verify-email'
    ];
    
    return !authEndpoints.some(endpoint => url.includes(endpoint));
  }

  /**
   * Clear authentication data locally and redirect to login
   * Avoid calling logout API which might cause more errors
   */
  private clearAuthAndRedirect(): void {
    // Clear auth data locally without API call
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('cached_matches');
    
    // Redirect to login
    this.router.navigate(['/login']);
  }
}