import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-list',
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users: any[] = [];
  isLoading: boolean = false;
  error: string = '';
  // Track which user is being edited
  editingUserId: string | null = null;

 


  // Filtering state
  selectedRole: string = '';
  selectedDepartment: string = '';

  // Filter options
  roles: string[] = ['Cadre', 'Operateur', 'Admin', 'En attente'];
  departments: string[] = ['HSEEn', 'RH', 'IT', 'Qualite', 'Maintenance'];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.isLoading = false;
      }
    });
  }

   // Temporary form values for the row being edited
  editValues: { nom: string; email: string; departement: string } = {
    nom: '',
    email: '',
    departement: ''
  };

   editUserInline(user: any): void {
    this.editingUserId = user._id;
    this.editValues = {
      nom: user.nom,
      email: user.email,
      departement: user.departement
    };
  }

  cancelEdit(): void {
    this.editingUserId = null;
    this.editValues = { nom: '', email: '', departement: '' };
  }

  saveUser(userId: string): void {
    this.userService.updateUser(userId, this.editValues).subscribe({
      next: () => {
        const index = this.users.findIndex(u => u._id === userId);
        if (index !== -1) {
          this.users[index] = {
            ...this.users[index],
            ...this.editValues
          };
        }
        this.cancelEdit();
      },
      error: () => {
        alert('Failed to update user');
      }
    });
  }


  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u._id !== userId);
        },
        error: () => {
          alert('Failed to delete user');
        }
      });
    }
  }

  editUser(userId: string): void {
    this.router.navigate(['/users/edit', userId]);
  }

  filteredUsers(): any[] {
    return this.users.filter(user => {
      const roleMatch = this.selectedRole ? user.role === this.selectedRole : true;
      const deptMatch = this.selectedDepartment ? user.departement === this.selectedDepartment : true;
      return roleMatch && deptMatch;
    });
  }
}
