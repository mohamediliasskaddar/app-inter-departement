// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService} from '../../../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [NgIf, ReactiveFormsModule, NgFor],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  departments = ['HSEEn', 'RH', 'IT', 'Qualite', 'Maintenance'];

  // Field edit toggles
  isEditingName = false;
  isEditingEmail = false;
  isEditingDepartment = false;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: [''],
      email: [''],
      department: [''],
      role: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          department: user.department,
          role: user.role
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load profile';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    const updateData = {
      name: this.profileForm.value.name,
      email: this.profileForm.value.email,
      department: this.profileForm.value.department
    };

    this.userService.updateCurrentUser(updateData).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully';
        this.errorMessage = '';
        this.isEditingName = false;
        this.isEditingEmail = false;
        this.isEditingDepartment = false;
      },
      error: () => {
        this.successMessage = '';
        this.errorMessage = 'Failed to update profile';
      }
    });
  }
}

