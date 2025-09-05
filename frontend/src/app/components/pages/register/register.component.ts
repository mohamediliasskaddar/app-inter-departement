import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  departements = [
    { _id: 'RH', nom: 'RH: Ressources humaines' },
    { _id: 'HSEEn', nom: ' HSEEn: Hygiène, Sécurité, Énergies, Environnement' },
    { _id: 'Qualite', nom: 'Qualité' },
    { _id: 'Maintenance', nom: 'Maintenance' },
    { _id: 'IT', nom: 'IT: Informatique' }
  ];

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(2)]],
      role: [{ value: 'En attente', disabled: true }], 
      departement: ['', Validators.required]
    });
  }

  get f() {
      return this.registerForm.controls;
    }


  register() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Tous les champs requis doivent être valides.';
      this.successMessage = '';
      return;
    }

    const formData = {
      ...this.registerForm.getRawValue() // pour inclure le champ désactivé "role"
    };

    this.auth.register(formData).subscribe({
      next: () => {
        this.successMessage = 'Inscription réussie. Redirection...';
        this.errorMessage = '';
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de l’inscription.';
        this.successMessage = '';
      }
    });
  }
}
