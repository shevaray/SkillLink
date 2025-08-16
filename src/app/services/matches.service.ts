import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Match {
  id: number;
  name: string;
  email: string;
  about_me: string;
  teaching_style: string;
  skill_level: string;
  profile_picture_path: string;
  availability: string;
  created_at: string;
  updated_at: string;
  gender?: string;
  teaches?: string[];
  wants_to_learn?: string[];
}

export interface MatchesResponse {
  perfect_matches: Match[];
  recommended_matches: Match[];
}

@Injectable({
  providedIn: 'root'
})
export class MatchesService {
  private readonly apiUrl = environment.apiUrl;
  private readonly matchesKey = 'cached_matches';
  
  private perfectMatchesSubject = new BehaviorSubject<Match[]>([]);
  private recommendedMatchesSubject = new BehaviorSubject<Match[]>([]);
  
  public perfectMatches$ = this.perfectMatchesSubject.asObservable();
  public recommendedMatches$ = this.recommendedMatchesSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load cached matches on service initialization
    this.loadCachedMatches();
  }

  /**
   * Fetch matches from API
   */
  fetchMatches(): Observable<MatchesResponse> {
    return this.http.get<MatchesResponse>(`${this.apiUrl}/matches`).pipe(
      tap(response => {
        this.updateMatches(response);
        this.cacheMatches(response);
      })
    );
  }

  /**
   * Get current perfect matches
   */
  getPerfectMatches(): Match[] {
    return this.perfectMatchesSubject.value;
  }

  /**
   * Get current recommended matches
   */
  getRecommendedMatches(): Match[] {
    return this.recommendedMatchesSubject.value;
  }

  /**
   * Update matches in memory
   */
  private updateMatches(matches: MatchesResponse): void {
    this.perfectMatchesSubject.next(matches.perfect_matches || []);
    this.recommendedMatchesSubject.next(matches.recommended_matches || []);
  }

  /**
   * Cache matches to localStorage
   */
  private cacheMatches(matches: MatchesResponse): void {
    try {
      const cacheData = {
        data: matches,
        timestamp: new Date().getTime()
      };
      localStorage.setItem(this.matchesKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache matches:', error);
    }
  }

  /**
   * Load cached matches from localStorage
   */
  private loadCachedMatches(): void {
    try {
      const cached = localStorage.getItem(this.matchesKey);
      if (cached) {
        const cacheData = JSON.parse(cached);
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        // Check if cache is still valid (less than 1 hour old)
        if (new Date().getTime() - cacheData.timestamp < oneHour) {
          this.updateMatches(cacheData.data);
        } else {
          // Cache expired, remove it
          localStorage.removeItem(this.matchesKey);
        }
      }
    } catch (error) {
      console.warn('Failed to load cached matches:', error);
      localStorage.removeItem(this.matchesKey);
    }
  }

  /**
   * Clear matches cache
   */
  clearCache(): void {
    localStorage.removeItem(this.matchesKey);
    this.perfectMatchesSubject.next([]);
    this.recommendedMatchesSubject.next([]);
  }

  /**
   * Generate initials from full name
   */
  static generateInitials(name: string): string {
    if (!name || typeof name !== 'string') return '??';
    
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      // Single name - take first two characters
      return words[0].substring(0, 2).toUpperCase();
    } else {
      // Multiple names - take first character of first two words
      return words.slice(0, 2)
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase();
    }
  }

  /**
   * Connect with a user
   */
  connectWithUser(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/connect`, { user_id: userId });
  }

  /**
   * Get user profile by ID
   */
  getUserProfile(userId: number): Observable<Match> {
    return this.http.get<Match>(`${this.apiUrl}/users/${userId}`);
  }
}