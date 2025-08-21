import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { ProfileService, Skill, ProfileUpdateRequest, SkillsUpdateRequest, PasswordUpdateRequest, ProfilePictureResponse } from '../../services/profile.service';
import { AuthService, UserProfile } from '../../services/auth.service';

@Component({
  selector: 'app-edit-profile-information',
  templateUrl: './edit-profile-information.component.html',
  styleUrls: ['./edit-profile-information.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class EditProfileInformationComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Forms
  profileForm!: FormGroup;
  personalInfoForm!: FormGroup;
  passwordForm!: FormGroup;

  // Data
  userProfile: UserProfile | null = null;
  allSkills: Skill[] = [];
  selectedSkillsToTeach: number[] = [];
  selectedSkillsToLearn: number[] = [];
  userAvailability: boolean[][] = [];

  // Profile Picture
  currentProfilePicture: string | null = null;
  selectedFile: File | null = null;

  // Loading states
  loading = false;
  loadingProfile = true;
  loadingSkills = true;
  updatingProfile = false;
  updatingPassword = false;
  uploadingPicture = false;

  // Error states
  error = '';
  profileError = '';
  passwordError = '';

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    // Personal Information Form
    this.personalInfoForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]]
    });

    // Profile Form
    this.profileForm = this.fb.group({
      bio: ['', [Validators.required, Validators.maxLength(1000)]],
      teaching: ['', [Validators.required, Validators.maxLength(1000)]],
      skillLevel: ['', Validators.required]
    });

    // Password Form
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private loadInitialData(): void {
    this.loading = true;
    
    // Load profile and skills in parallel
    forkJoin({
      profile: this.profileService.getProfile(),
      skills: this.profileService.getAllSkills()
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({ profile, skills }) => {
        this.userProfile = profile;
        this.allSkills = skills;
        this.populateFormsWithData(profile);
        this.loading = false;
        this.loadingProfile = false;
        this.loadingSkills = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load profile data.';
        this.loading = false;
        this.loadingProfile = false;
        this.loadingSkills = false;
        console.error('Error loading profile data:', error);
      }
    });
  }

  private populateFormsWithData(profile: UserProfile): void {
    // Personal Info Form
    this.personalInfoForm.patchValue({
      name: profile.name,
      email: profile.email
    });

    // Profile Form
    this.profileForm.patchValue({
      bio: profile.about_me || '',
      teaching: profile.teaching_style || '',
      skillLevel: profile.skill_level || ''
    });

    // Set current profile picture
    this.currentProfilePicture = profile.profile_picture_path || null;

    // Parse availability data
    this.userAvailability = this.parseAvailability(profile.availability || '{}');
    
    // Note: Skills will be handled separately when we get them from API
    // For now, we'll initialize empty arrays
    this.selectedSkillsToTeach = [];
    this.selectedSkillsToLearn = [];
  }

  onUpdatePersonalInfo(): void {
    if (!this.personalInfoForm.valid || !this.userProfile) return;

    // Note: Name can be updated via profile endpoint, email might need separate handling
    const formValue = this.personalInfoForm.value;
    const profileData: ProfileUpdateRequest = {
      name: formValue.name,
      about_me: this.userProfile.about_me || '',
      teaching_style: this.userProfile.teaching_style || '',
      skill_level: this.userProfile.skill_level || '',
      availability: this.userProfile.availability || '{}'
    };

    this.profileService.updateProfile(profileData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (updatedProfile) => {
        this.userProfile = updatedProfile;
        // Update localStorage
        this.authService.updateStoredUserProfile(updatedProfile);
        alert('Personal information updated successfully!');
      },
      error: (error) => {
        this.profileError = error.message || 'Failed to update personal information.';
        console.error('Error updating personal info:', error);
      }
    });
  }

  onUpdateProfile(): void {
    if (!this.profileForm.valid || !this.userProfile) return;

    this.updatingProfile = true;
    this.profileError = '';

    const formValue = this.profileForm.value;
    
    const profileData: ProfileUpdateRequest = {
      name: this.userProfile.name,
      about_me: formValue.bio,
      teaching_style: formValue.teaching,
      skill_level: formValue.skillLevel,
      availability: JSON.stringify(this.userAvailability)
    };

    const skillsData: SkillsUpdateRequest = {
      skills_to_teach: this.selectedSkillsToTeach,
      skills_to_learn: this.selectedSkillsToLearn
    };

    this.profileService.updateProfileAndSkills(profileData, skillsData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (result) => {
        this.updatingProfile = false;
        this.userProfile = result.profile;
        // Update localStorage
        this.authService.updateStoredUserProfile(result.profile);
        alert('Profile updated successfully!');
      },
      error: (error) => {
        this.updatingProfile = false;
        this.profileError = error.message || 'Failed to update profile.';
        console.error('Error updating profile:', error);
      }
    });
  }

  onUpdatePassword(): void {
    if (!this.passwordForm.valid) return;

    this.updatingPassword = true;
    this.passwordError = '';

    const formValue = this.passwordForm.value;
    const passwordData: PasswordUpdateRequest = {
      current_password: formValue.currentPassword,
      password: formValue.newPassword,
      password_confirmation: formValue.confirmPassword
    };

    this.profileService.updatePassword(passwordData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.updatingPassword = false;
        this.passwordForm.reset();
        alert('Password updated successfully!');
      },
      error: (error) => {
        this.updatingPassword = false;
        this.passwordError = error.message || 'Failed to update password.';
        console.error('Error updating password:', error);
      }
    });
  }

  onSkillToggle(skillId: number, type: 'teach' | 'learn'): void {
    if (type === 'teach') {
      const index = this.selectedSkillsToTeach.indexOf(skillId);
      if (index > -1) {
        this.selectedSkillsToTeach.splice(index, 1);
      } else {
        this.selectedSkillsToTeach.push(skillId);
      }
    } else {
      const index = this.selectedSkillsToLearn.indexOf(skillId);
      if (index > -1) {
        this.selectedSkillsToLearn.splice(index, 1);
      } else {
        this.selectedSkillsToLearn.push(skillId);
      }
    }
  }

  isSkillSelected(skillId: number, type: 'teach' | 'learn'): boolean {
    return type === 'teach' 
      ? this.selectedSkillsToTeach.includes(skillId)
      : this.selectedSkillsToLearn.includes(skillId);
  }

  retryLoadData(): void {
    this.error = '';
    this.loadInitialData();
  }

  /**
   * Handle availability changes from scheduler component
   */
  onSchedulerSelectionChange(selectedSlots: any[]): void {
    // Convert SchedulerSlot[] back to boolean matrix
    this.userAvailability = this.convertSlotsToMatrix(selectedSlots);
  }

  /**
   * Parse availability JSON string to boolean array
   */
  private parseAvailability(availabilityString: string): boolean[][] {
    try {
      const parsed = JSON.parse(availabilityString);
      // If it's already in the correct format, return it
      if (Array.isArray(parsed) && Array.isArray(parsed[0])) {
        return parsed;
      }
      // Otherwise, return default availability
      return this.getDefaultAvailability();
    } catch (error) {
      console.warn('Failed to parse availability:', error);
      return this.getDefaultAvailability();
    }
  }

  /**
   * Get default availability matrix (all false)
   */
  private getDefaultAvailability(): boolean[][] {
    return [
      [false, false, false, false, false, false, false], // 9am-11am
      [false, false, false, false, false, false, false], // 11am-1pm
      [false, false, false, false, false, false, false], // 1pm-3pm
      [false, false, false, false, false, false, false], // 3pm-5pm
      [false, false, false, false, false, false, false], // 5pm-7pm
      [false, false, false, false, false, false, false]  // 7pm-9pm
    ];
  }

  /**
   * Convert SchedulerSlot array back to boolean matrix
   */
  private convertSlotsToMatrix(selectedSlots: any[]): boolean[][] {
    const timeSlots = ['9am-11am', '11am-1pm', '1pm-3pm', '3pm-5pm', '5pm-7pm', '7pm-9pm'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Initialize with all false
    const matrix = this.getDefaultAvailability();
    
    // Mark selected slots as true
    selectedSlots.forEach(slot => {
      const timeIndex = timeSlots.indexOf(slot.time);
      const dayIndex = days.indexOf(slot.day);
      
      if (timeIndex !== -1 && dayIndex !== -1) {
        matrix[timeIndex][dayIndex] = true;
      }
    });
    
    return matrix;
  }

  /**
   * Handle profile picture circle click - opens file selection
   */
  onProfilePictureClick(): void {
    this.fileInput.nativeElement.click();
  }

  /**
   * Handle file selection from file input
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        return;
      }
      
      this.selectedFile = file;
      
      // Create preview URL and display it
      const reader = new FileReader();
      reader.onload = (e) => {
        this.currentProfilePicture = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Handle profile picture upload
   */
  onUploadProfilePicture(): void {
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }

    this.uploadingPicture = true;

    this.profileService.uploadProfilePicture(this.selectedFile).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.uploadingPicture = false;
        this.currentProfilePicture = response.profile_picture_path;
        this.selectedFile = null;
        
        // Update user profile in memory and localStorage
        if (this.userProfile) {
          this.userProfile.profile_picture_path = response.profile_picture_path;
          this.authService.updateStoredUserProfile(this.userProfile);
        }
        
        alert('Profile picture uploaded successfully!');
      },
      error: (error) => {
        this.uploadingPicture = false;
        console.error('Error uploading profile picture:', error);
        alert('Failed to upload profile picture. Please try again.');
      }
    });
  }

  /**
   * Handle image error by setting fallback
   */
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = '/assets/human-pic.png';
    }
  }
} 