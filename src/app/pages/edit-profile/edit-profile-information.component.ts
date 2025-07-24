import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile-information',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile-information.component.html',
  styleUrls: ['./edit-profile-information.component.scss']
})
export class EditProfileInformationComponent {
  profileForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?\d{10,15}$/)]],
      bio: [''],
      location: ['']
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.profileForm.valid) {
      // Save profile logic here
    }
  }
} 