import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatchesService } from '../../services/matches.service';
import { NotificationService } from '../../services/notification.service';

export interface MockMatch {
  id: number;
  name: string;
  avatar: string;
  skillLevel: string;
  bio: string;
  skillsToTeach: string[];
  skillsToLearn: string[];
  availability: string;
  matchPercentage: number;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SearchComponent implements OnInit, OnDestroy {
  searchForm!: FormGroup;
  loading = false;
  showResults = false;
  mockResults: MockMatch[] = [];

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
    
    // Generate mock results based on search criteria
    this.mockResults = [
      {
        id: 1,
        name: 'Sarah Johnson',
        avatar: '/assets/human-pic.png',
        skillLevel: 'Advanced',
        bio: 'Passionate developer with 5+ years of experience in web technologies. Love teaching and sharing knowledge with others.',
        skillsToTeach: ['JavaScript', 'React', 'Node.js'],
        skillsToLearn: ['Python', 'Machine Learning'],
        availability: 'Weekday Evenings',
        matchPercentage: 95
      },
      {
        id: 2,
        name: 'Michael Chen',
        avatar: '/assets/human-pic.png',
        skillLevel: 'Expert',
        bio: 'Full-stack engineer specializing in modern web frameworks. Always excited to mentor newcomers.',
        skillsToTeach: ['Python', 'Django', 'PostgreSQL'],
        skillsToLearn: ['React Native', 'Flutter'],
        availability: 'Weekend Afternoons',
        matchPercentage: 88
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        avatar: '/assets/human-pic.png',
        skillLevel: 'Intermediate',
        bio: 'UI/UX Designer transitioning to frontend development. Eager to learn and collaborate.',
        skillsToTeach: ['UI Design', 'Figma', 'CSS'],
        skillsToLearn: ['JavaScript', 'Vue.js'],
        availability: 'Flexible',
        matchPercentage: 82
      },
      {
        id: 4,
        name: 'David Kim',
        avatar: '/assets/human-pic.png',
        skillLevel: 'Advanced',
        bio: 'DevOps engineer with expertise in cloud technologies. Love automating workflows and teaching best practices.',
        skillsToTeach: ['AWS', 'Docker', 'Kubernetes'],
        skillsToLearn: ['GraphQL', 'TypeScript'],
        availability: 'Weekday Mornings',
        matchPercentage: 76
      },
      {
        id: 5,
        name: 'Lisa Wang',
        avatar: '/assets/human-pic.png',
        skillLevel: 'Intermediate',
        bio: 'Data scientist passionate about machine learning and AI. Looking to expand into web development.',
        skillsToTeach: ['Python', 'Data Analysis', 'Machine Learning'],
        skillsToLearn: ['React', 'API Development'],
        availability: 'Weekend Evenings',
        matchPercentage: 71
      }
    ];

    // Filter results based on search criteria if needed
    const skillsToLearn = formValues.skillsToLearn?.toLowerCase() || '';
    
    // Simple filtering logic - in a real app this would be done by the backend
    if (skillsToLearn) {
      this.mockResults = this.mockResults.filter(match => 
        match.skillsToTeach.some(skill => 
          skill.toLowerCase().includes(skillsToLearn) ||
          skillsToLearn.includes(skill.toLowerCase())
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
}