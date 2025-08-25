import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SessionRequest {
  teacher_id: number;
  skill_id: number;
  scheduled_at: string;
}

export interface SessionResponse {
  id: number;
  teacher_id: number;
  student_id: number;
  skill_id: number;
  scheduled_at: string;
  status: string;
  created_at: string;
  updated_at: string;
  skill?: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  teacher?: any;
  student?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Schedule a new session
   */
  scheduleSession(sessionRequest: SessionRequest): Observable<SessionResponse> {
    return this.http.post<SessionResponse>(`${this.apiUrl}/sessions`, sessionRequest);
  }

  /**
   * Get all sessions for current user
   */
  getUserSessions(): Observable<SessionResponse[]> {
    return this.http.get<SessionResponse[]>(`${this.apiUrl}/sessions`);
  }

  /**
   * Cancel a session
   */
  cancelSession(sessionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sessions/${sessionId}`);
  }

  /**
   * Update session status
   */
  updateSessionStatus(sessionId: number, status: string): Observable<SessionResponse> {
    return this.http.patch<SessionResponse>(`${this.apiUrl}/sessions/${sessionId}`, { status });
  }

  /**
   * Accept a session
   */
  acceptSession(sessionId: number): Observable<any> {
    const url = `${this.apiUrl}/sessions/${sessionId}/accept`;
    console.log('Making accept session API call to:', url);
    return this.http.post(url, {});
  }

  /**
   * Decline a session
   */
  declineSession(sessionId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/sessions/${sessionId}/decline`, {});
  }
}