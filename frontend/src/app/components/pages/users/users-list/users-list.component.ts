// // users-list.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-users-list',
//   imports: [NgIf, NgFor],
//   templateUrl: './users-list.component.html',
//   styleUrls: ['./users-list.component.css']
// })
// export class UsersListComponent implements OnInit {

//   users: any[] = [];
//   isLoading: boolean = false;
//   error: string = '';

//   constructor(private userService: UserService, private router: Router) {}

//   ngOnInit(): void {
//     this.fetchUsers();
//   }

//   fetchUsers(): void {
//     this.isLoading = true;
//     this.userService.getUsers().subscribe({
//       next: (data) => {
//         this.users = data;
//         this.isLoading = false;
//       },
//       error: (err) => {
//         this.error = 'Failed to load users';
//         this.isLoading = false;
//       }
//     });
//   }

//   deleteUser(userId: string): void {
//     if (confirm('Are you sure you want to delete this user?')) {
//       this.userService.deleteUser(userId).subscribe({
//         next: () => {
//           this.users = this.users.filter(u => u._id !== userId);
//         },
//         error: () => {
//           alert('Failed to delete user');
//         }
//       });
//     }
//   }

//   editUser(userId: string): void {
//     // Navigate to an edit-user form (if you have a separate route)
//     this.router.navigate(['/users/edit', userId]);
//   }

// }

// import { Component, OnInit } from '@angular/core';
// import { UserService } from '../../../../services/user.service';
// import { Router } from '@angular/router';

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
