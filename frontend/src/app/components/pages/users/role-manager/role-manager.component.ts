// role-manager.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-role-manager',
  imports: [NgFor, NgIf],
  templateUrl: './role-manager.component.html',
  styleUrls: ['./role-manager.component.css']
})
export class RoleManagerComponent implements OnInit {

  pendingUsers: any[] = [];
  isLoading: boolean = false;
  error: string = '';
  availableRoles: string[] = ['admin', 'employee', 'manager']; // adjust based on your system

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.fetchPendingUsers();
  }

  fetchPendingUsers(): void {
    this.isLoading = true;
    this.userService.getUsersEnAttente().subscribe({
      next: (data) => {
        this.pendingUsers = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load pending users';
        this.isLoading = false;
      }
    });
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.pendingUsers = this.pendingUsers.filter(u => u._id !== userId);
        },
        error: () => {
          alert('Failed to delete user');
        }
      });
    }
  }

  assignRole(userId: string, role: string): void {
    this.userService.changeUserRole(userId, role).subscribe({
      next: () => {
        // Optionally, refresh the list or remove the user from this view
        this.pendingUsers = this.pendingUsers.filter(u => u._id !== userId);
      },
      error: () => {
        alert('Failed to assign role');
      }
    });
  }

  editUser(userId: string): void {
    this.router.navigate(['/users/edit', userId]); // Optional: if you want to allow editing from here
  }

}
