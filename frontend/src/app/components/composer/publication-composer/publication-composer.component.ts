import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IPublication } from '../../../utils/models';
import { RouterLink } from '@angular/router';
import { PublicationsService } from '../../../services/publications.service';
import { NgIf } from '@angular/common';
import { PUBLICATION_LABELS } from '../../../utils/pub-labels';


@Component({
  selector: 'app-publication-composer',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './publication-composer.component.html',
  styleUrls: ['./publication-composer.component.css']
})
export class PublicationComposerComponent implements OnInit {

  publicationForm: FormGroup;
  labelMap = PUBLICATION_LABELS;
  type: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private pubs: PublicationsService
  ) {
    this.publicationForm = this.fb.group({
      titre: [''],
      description: [''],
      type: [''],
      // departement: [''],
      dateDebut: [''],
      dateFin: [''],
      image: [null],
      statut: ['ouverte']
    });
  }

  ngOnInit() {
    // Listen to type changes to reflect updated labels dynamically in the template
    this.publicationForm.get('type')?.valueChanges.subscribe(value => {
      this.type = value;
    });
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.publicationForm.patchValue({ image: file });
    }
  }

  submitPublication() {
    if (this.publicationForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
      this.successMessage = '';
      return;
    }

    const formValues = this.publicationForm.value;
    const formData = new FormData();

    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (value instanceof File || value instanceof Blob) {
          formData.append(key, value);
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    this.pubs.createPublication(formData).subscribe({
      next: () => {
        this.successMessage = 'Publication créée avec succès.';
        this.errorMessage = '';
        this.publicationForm.reset();
        this.type = ''; // Reset type to hide fields
      },
      error: (err) => {
        console.error('Erreur lors de la création de la publication:', err);
        this.errorMessage = 'Erreur lors de la création de la publication.';
        this.successMessage = '';
      }
    });
  }
}
