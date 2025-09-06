// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService} from '../../../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  imports: [NgIf, ReactiveFormsModule, NgFor, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  departments = ['HSEEn', 'RH', 'IT', 'Qualite', 'Maintenance'];
  avatarUrl!: string;

  // Field edit toggles
  isEditingName = false;
  isEditingEmail = false;
  isEditingDepartment = false;see3

  constructor(private userService: UserService,
     private fb: FormBuilder,
    public dialogRef : MatDialogRef<ProfileComponent> ) {
    this.profileForm = this.fb.group({
      nom: [''],
      email: [''],
      departement: [''],
      role: [{ value: '', disabled: true }]
    });
  }

  createAvatarUrl(name: string) {
    this.avatarUrl =  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
  }

        // this.avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(this.user.nom)}`;

  ngOnInit(): void {
    this.loadProfile();
  }

  closeDialog() { 
    this.dialogRef.close();
  }



  loadProfile(): void {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          nom: user.nom,
          email: user.email,
          departement: user.departement,
          role: user.role
          
        });
        this.createAvatarUrl(user.nom);
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
      nom: this.profileForm.value.nom,
      email: this.profileForm.value.email,
      departement: this.profileForm.value.departement
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

