import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  terms: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;           // For some endpoints
  access_token?: string;    // For Laravel Sanctum/Passport
  token_type?: string;      // Bearer token type
  user?: {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
  };
  message?: string;
  isFirstTimeUser?: boolean; // TODO: Backend will provide this flag
}

export interface ApiError {
  message: string;
  errors?: { [key: string]: string[] };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'user_data';
  
  private authStatusSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public authStatus$ = this.authStatusSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Register a new user
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        const token = this.extractToken(response);
        if (token) {
          this.saveAuthData(token, response.user);
        }
      })
    );
  }

  /**
   * Login user
   */
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        const token = this.extractToken(response);
        if (token) {
          this.saveAuthData(token, response.user);
        }
      })
    );
  }

  /**
   * Logout user
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearAuthData();
      })
    );
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Get current user data
   */
  getCurrentUser(): any | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  /**
   * Extract token from response (handles both token and access_token formats)
   */
  private extractToken(response: AuthResponse): string | null {
    return response.access_token || response.token || null;
  }

  /**
   * Save authentication data to localStorage
   */
  private saveAuthData(token: string, user: any): void {
    console.log('Saving auth data - Token:', token.substring(0, 20) + '...', 'User:', user);
    
    localStorage.setItem(this.tokenKey, token);
    
    // Save user data if provided, otherwise create minimal user object
    const userData = user || {
      id: 0,
      name: 'User',
      email: '',
      email_verified_at: null
    };
    localStorage.setItem(this.userKey, JSON.stringify(userData));
    
    this.authStatusSubject.next(true);
    console.log('Auth data saved successfully. Token exists:', !!this.getToken());
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.authStatusSubject.next(false);
  }

  /**
   * Check if there's a valid token
   */
  private hasValidToken(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token;
  }

  /**
   * Refresh token (implement when backend supports it)
   */
  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {}).pipe(
      tap(response => {
        const token = this.extractToken(response);
        if (token) {
          this.saveAuthData(token, response.user);
        }
      })
    );
  }

  /**
   * Send password reset email
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  /**
   * Reset password with token
   */
  resetPassword(token: string, email: string, password: string, passwordConfirmation: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      token,
      email,
      password,
      password_confirmation: passwordConfirmation
    });
  }

  /**
   * Verify email with token
   */
  verifyEmail(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email`, { token });
  }

  /**
   * Resend email verification
   */
  resendVerification(): Observable<any> {
    return this.http.post(`${this.apiUrl}/email/verification-notification`, {});
  }
}