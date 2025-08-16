import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatchCardComponent } from '../../components/matchcard/matchcard.component';
import { MatchesService, Match } from '../../services/matches.service';

@Component({
  selector: 'app-regular-dashboard',
  templateUrl: './regular-dashboard.component.html',
  styleUrls: ['./regular-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatchCardComponent]
})
export class RegularDashboardComponent implements OnInit, OnDestroy {
  perfectMatches: Match[] = [];
  recommendedMatches: Match[] = [];
  loading = false;
  error = '';
  
  private destroy$ = new Subject<void>();

  constructor(private matchesService: MatchesService) {}

  ngOnInit(): void {
    this.loadMatches();
    this.subscribeToMatches();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load matches from API
   */
  loadMatches(): void {
    this.loading = true;
    this.error = '';

    this.matchesService.fetchMatches().subscribe({
      next: () => {
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.error = error.message || 'Failed to load matches. Please try again.';
        console.error('Error loading matches:', error);
      }
    });
  }

  /**
   * Subscribe to matches updates
   */
  private subscribeToMatches(): void {
    this.matchesService.perfectMatches$
      .pipe(takeUntil(this.destroy$))
      .subscribe(matches => {
        this.perfectMatches = matches;
      });

    this.matchesService.recommendedMatches$
      .pipe(takeUntil(this.destroy$))
      .subscribe(matches => {
        this.recommendedMatches = matches;
      });
  }

  /**
   * Retry loading matches
   */
  retryLoad(): void {
    this.loadMatches();
  }

  /**
   * Handle match card connect action
   */
  onConnect(match: Match): void {
    console.log('Connect with:', match);
    // TODO: Implement connect functionality
  }

  /**
   * Handle match card view profile action
   */
  onViewProfile(match: Match): void {
    console.log('View profile:', match);
    // TODO: Navigate to profile or open modal
  }

  /**
   * Generate initials from name
   */
  generateInitials(name: string): string {
    return MatchesService.generateInitials(name);
  }

  /**
   * Get teaches value with fallback
   */
  getTeaches(match: Match): string {
    if (match.teaches && match.teaches.length > 0) {
      return match.teaches.join(', ');
    }
    return 'To be determined';
  }

  /**
   * Get wants to learn value with fallback
   */
  getWantsToLearn(match: Match): string {
    if (match.wants_to_learn && match.wants_to_learn.length > 0) {
      return match.wants_to_learn.join(', ');
    }
    return 'To be determined';
  }

  /**
   * Get gender with fallback
   */
  getGender(match: Match): string {
    return match.gender || 'To be determined';
  }
} 