import { Component, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss'],
  standalone: true,
  imports: [RouterModule]
})
export class AccountMenuComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  
  private isDesktop: boolean = false;

  ngOnInit(): void {
    this.checkScreenSize();
  }

  ngOnDestroy(): void {
    // Clean up any listeners if needed
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Only handle document clicks on desktop screens
    if (this.isDesktop) {
      const target = event.target as HTMLElement;
      const accountMenu = target.closest('.account-menu__dropdown');
      const accountMenuTrigger = target.closest('[data-account-menu-trigger]'); // Add this attribute to your trigger button
      
      // If click is outside the account menu and not on the trigger button, close the menu
      if (!accountMenu && !accountMenuTrigger) {
        this.close.emit();
      }
    }
  }

  private checkScreenSize(): void {
    this.isDesktop = window.innerWidth > 991.98;
  }

  onOverlayClick(): void {
    // Only handle overlay clicks on mobile screens
    if (!this.isDesktop) {
      this.close.emit();
    }
  }
} 