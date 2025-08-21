import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserProfile } from './auth.service';

export interface ProfileUpdateRequest {
  name: string;
  about_me: string;
  teaching_style: string;
  skill_level: string;
  availability: string;
}

export interface SkillsUpdateRequest {
  skills_to_teach: number[];
  skills_to_learn: number[];
}

export interface PasswordUpdateRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface Skill {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ProfilePictureResponse {
  profile_picture_path: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get user profile
   */
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`);
  }

  /**
   * Update user profile (basic information)
   */
  updateProfile(data: ProfileUpdateRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/profile`, data);
  }

  /**
   * Update user skills
   */
  updateSkills(data: SkillsUpdateRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/skills`, data);
  }

  /**
   * Update user password
   */
  updatePassword(data: PasswordUpdateRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/password`, data);
  }

  /**
   * Get all available skills
   */
  getAllSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.apiUrl}/skills`);
  }

  /**
   * Upload profile picture
   */
  uploadProfilePicture(file: File): Observable<ProfilePictureResponse> {
    const formData = new FormData();
    formData.append('picture', file);
    
    return this.http.post<ProfilePictureResponse>(`${this.apiUrl}/profile/picture`, formData);
  }

  /**
   * Update both profile and skills simultaneously
   */
  updateProfileAndSkills(
    profileData: ProfileUpdateRequest, 
    skillsData: SkillsUpdateRequest
  ): Observable<any> {
    // Use forkJoin to make both requests simultaneously
    const profile$ = this.updateProfile(profileData);
    const skills$ = this.updateSkills(skillsData);
    
    return new Observable(observer => {
      let profileComplete = false;
      let skillsComplete = false;
      let profileResult: any;
      let skillsResult: any;
      let hasError = false;

      const checkCompletion = () => {
        if (profileComplete && skillsComplete && !hasError) {
          observer.next({
            profile: profileResult,
            skills: skillsResult
          });
          observer.complete();
        }
      };

      profile$.subscribe({
        next: (result) => {
          profileResult = result;
          profileComplete = true;
          checkCompletion();
        },
        error: (error) => {
          hasError = true;
          observer.error({ type: 'profile', error });
        }
      });

      skills$.subscribe({
        next: (result) => {
          skillsResult = result;
          skillsComplete = true;
          checkCompletion();
        },
        error: (error) => {
          hasError = true;
          observer.error({ type: 'skills', error });
        }
      });
    });
  }
}