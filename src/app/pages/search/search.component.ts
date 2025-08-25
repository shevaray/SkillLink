import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatchesService, Match } from '../../services/matches.service';
import { NotificationService } from '../../services/notification.service';
import { MatchCardComponent } from '../../components/matchcard/matchcard.component';

// Remove the MockMatch interface as we'll use the Match interface from MatchesService

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatchCardComponent]
})
export class SearchComponent implements OnInit, OnDestroy {
  searchForm!: FormGroup;
  loading = false;
  showResults = false;
  mockResults: Match[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private matchesService: MatchesService,
    private notificationService: NotificationService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Check if there's a search query from navbar or route params
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params['q']) {
        // Pre-fill the skills to learn field with the search query
        this.searchForm.patchValue({
          skillsToLearn: params['q']
        });
      }
      if (params['showResults'] === 'true') {
        this.showResults = true;
        this.generateMockResults();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.searchForm = this.fb.group({
      skillsToLearn: ['', Validators.required],
      skillsICanTeach: [''],
      skillLevel: ['', Validators.required],
      availability: ['', Validators.required]
    });
  }

  findPerfectMatch(): void {
    if (this.searchForm.invalid) {
      Object.keys(this.searchForm.controls).forEach(key => {
        this.searchForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;

    // Simulate API call delay
    setTimeout(() => {
      this.generateMockResults();
      this.showResults = true;
      this.loading = false;
      
      // Update URL to show results state
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { showResults: 'true' },
        queryParamsHandling: 'merge'
      });
    }, 2000);
  }

  private generateMockResults(): void {
    const formValues = this.searchForm.value;
    
    // Generate mock results based on search criteria using Match interface
    this.mockResults = [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        about_me: 'Passionate developer with 5+ years of experience in web technologies. Love teaching and sharing knowledge with others.',
        teaching_style: 'Interactive and hands-on approach',
        skill_level: 'Advanced',
        profile_picture_path: '/assets/human-pic.png',
        availability: '[[false,false,true,true,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false]]',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        gender: 'Female',
        skills_to_teach: [
          { id: 1, name: 'JavaScript', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 1, skill_id: 1 } },
          { id: 2, name: 'React', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 1, skill_id: 2 } },
          { id: 3, name: 'Node.js', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 1, skill_id: 3 } }
        ],
        skills_to_learn: [
          { id: 4, name: 'Python', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 1, skill_id: 4 } },
          { id: 5, name: 'Machine Learning', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 1, skill_id: 5 } }
        ]
      },
      {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        about_me: 'Full-stack engineer specializing in modern web frameworks. Always excited to mentor newcomers.',
        teaching_style: 'Project-based learning',
        skill_level: 'Expert',
        profile_picture_path: '/assets/human-pic.png',
        availability: '[[false,false,false,false,false,true,true],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false]]',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        gender: 'Male',
        skills_to_teach: [
          { id: 4, name: 'Python', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 2, skill_id: 4 } },
          { id: 6, name: 'Django', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 2, skill_id: 6 } },
          { id: 7, name: 'PostgreSQL', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 2, skill_id: 7 } }
        ],
        skills_to_learn: [
          { id: 8, name: 'React Native', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 2, skill_id: 8 } },
          { id: 9, name: 'Flutter', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 2, skill_id: 9 } }
        ]
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@example.com',
        about_me: 'UI/UX Designer transitioning to frontend development. Eager to learn and collaborate.',
        teaching_style: 'Design-first approach',
        skill_level: 'Intermediate',
        profile_picture_path: '/assets/human-pic.png',
        availability: '[[true,true,true,true,true,true,true],[true,true,true,true,true,true,true],[true,true,true,true,true,true,true],[true,true,true,true,true,true,true],[true,true,true,true,true,true,true],[true,true,true,true,true,true,true]]',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        gender: 'Female',
        skills_to_teach: [
          { id: 10, name: 'UI Design', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 3, skill_id: 10 } },
          { id: 11, name: 'Figma', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 3, skill_id: 11 } },
          { id: 12, name: 'CSS', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 3, skill_id: 12 } }
        ],
        skills_to_learn: [
          { id: 1, name: 'JavaScript', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 3, skill_id: 1 } },
          { id: 13, name: 'Vue.js', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 3, skill_id: 13 } }
        ]
      },
      {
        id: 4,
        name: 'David Kim',
        email: 'david.kim@example.com',
        about_me: 'DevOps engineer with expertise in cloud technologies. Love automating workflows and teaching best practices.',
        teaching_style: 'Real-world examples',
        skill_level: 'Advanced',
        profile_picture_path: '/assets/human-pic.png',
        availability: '[[true,true,false,false,false,false,false],[true,true,false,false,false,false,false],[true,true,false,false,false,false,false],[true,true,false,false,false,false,false],[true,true,false,false,false,false,false],[true,true,false,false,false,false,false]]',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        gender: 'Male',
        skills_to_teach: [
          { id: 14, name: 'AWS', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 4, skill_id: 14 } },
          { id: 15, name: 'Docker', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 4, skill_id: 15 } },
          { id: 16, name: 'Kubernetes', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 4, skill_id: 16 } }
        ],
        skills_to_learn: [
          { id: 17, name: 'GraphQL', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 4, skill_id: 17 } },
          { id: 18, name: 'TypeScript', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 4, skill_id: 18 } }
        ]
      },
      {
        id: 5,
        name: 'Lisa Wang',
        email: 'lisa.wang@example.com',
        about_me: 'Data scientist passionate about machine learning and AI. Looking to expand into web development.',
        teaching_style: 'Data-driven approach',
        skill_level: 'Intermediate',
        profile_picture_path: '/assets/human-pic.png',
        availability: '[[false,false,false,false,false,true,true],[false,false,false,false,false,true,true],[false,false,false,false,false,true,true],[false,false,false,false,false,true,true],[false,false,false,false,false,true,true],[false,false,false,false,false,true,true]]',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        gender: 'Female',
        skills_to_teach: [
          { id: 4, name: 'Python', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 5, skill_id: 4 } },
          { id: 19, name: 'Data Analysis', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 5, skill_id: 19 } },
          { id: 5, name: 'Machine Learning', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 5, skill_id: 5 } }
        ],
        skills_to_learn: [
          { id: 2, name: 'React', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 5, skill_id: 2 } },
          { id: 20, name: 'API Development', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pivot: { user_id: 5, skill_id: 20 } }
        ]
      }
    ];

    // Filter results based on search criteria if needed
    const skillsToLearn = formValues.skillsToLearn?.toLowerCase() || '';
    
    // Simple filtering logic - in a real app this would be done by the backend
    if (skillsToLearn) {
      this.mockResults = this.mockResults.filter(match => 
        match.skills_to_teach?.some(skill => 
          skill.name.toLowerCase().includes(skillsToLearn) ||
          skillsToLearn.includes(skill.name.toLowerCase())
        )
      );
    }
  }

  goBackToSearch(): void {
    this.showResults = false;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { showResults: null },
      queryParamsHandling: 'merge'
    });
  }

  viewProfile(userId: number): void {
    this.router.navigate(['/home/profile', userId]);
  }

  connectWithUser(userId: number): void {
    this.matchesService.connectWithUser(userId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.notificationService.showSuccess('Connection request sent successfully!');
      },
      error: (error) => {
        console.error('Connect error:', error);
        this.notificationService.showError('Failed to send connection request.');
      }
    });
  }

  scheduleSession(userId: number): void {
    this.router.navigate(['/home/schedule-session', userId]);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = '/assets/human-pic.png';
    }
  }

  // Helper methods from dashboard component
  generateInitials(name: string): string {
    return MatchesService.generateInitials(name);
  }

  getTeaches(match: Match): string {
    // Check for new API structure first
    if (match.skills_to_teach && match.skills_to_teach.length > 0) {
      return match.skills_to_teach.map(skill => skill.name).join(', ');
    }
    // Fallback to old structure
    if (match.teaches && match.teaches.length > 0) {
      return match.teaches.join(', ');
    }
    return 'To be determined';
  }

  getWantsToLearn(match: Match): string {
    // Check for new API structure first
    if (match.skills_to_learn && match.skills_to_learn.length > 0) {
      return match.skills_to_learn.map(skill => skill.name).join(', ');
    }
    // Fallback to old structure
    if (match.wants_to_learn && match.wants_to_learn.length > 0) {
      return match.wants_to_learn.join(', ');
    }
    return 'To be determined';
  }

  getGender(match: Match): string {
    return match.gender || 'To be determined';
  }

  // Match card event handlers
  onConnect(match: Match): void {
    this.connectWithUser(match.id);
  }

  onViewProfile(match: Match): void {
    this.viewProfile(match.id);
  }
}