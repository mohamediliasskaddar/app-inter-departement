import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ FormsModule, ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    
  successMessage: string = '';
  errorMessage: string = '';
  loginForm: FormGroup;
  
  // Injecting AuthService, FormBuilder, and Router
  constructor(private auth: AuthService, private authform: FormBuilder, private router: Router) { 

    this.loginForm = this.authform.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(2)]]
    });

  }

  login() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Valid email and password are required.';
      this.successMessage = '';
      console.log('error : ', this.loginForm.value);
      return;
    }

    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.token) {
          this.auth.saveToken(res.token); // sauvegarde du JWT
          console.log('Token saved:', res.token);
          this.successMessage = 'Login successful!';
          console.log('success : ', this.loginForm.value);
          this.errorMessage = '';
          this.router.navigate(['/dashboard']); // redirection selon ton app
        } else {
          this.errorMessage = res.message || 'Login failed.';
          this.successMessage = '';
          console.log('error : ', this.loginForm.value);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid credentials.';
        this.successMessage = '';
      }
    });
  }


}
