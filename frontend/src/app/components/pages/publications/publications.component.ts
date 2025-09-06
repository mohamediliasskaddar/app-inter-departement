import { Component, OnInit } from '@angular/core';
import { PublicationsService } from '../../../services/publications.service';
import { IPublication } from '../../../utils/models';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service'; 
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PublicationComposerComponent } from '../../composer/publication-composer/publication-composer.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [DatePipe,NgIf, NgFor, FormsModule, ReactiveFormsModule],
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css']
})

export class PublicationsComponent implements OnInit {

  publications: IPublication[] = [];
  editForms: Record<string, FormGroup> = {};
  editMode: Record<string, boolean> = {};
  currentUserId: string = '';
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private publicationService: PublicationsService,
    private authService: AuthService, // Assumes it provides current user info
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  openCreatePublicationDialog(): void {
      const dialogRef = this.dialog.open(PublicationComposerComponent, {
        width: '600px', // or 80%, 500px, etc.
        disableClose: true, // Prevent click-outside to close
        panelClass: 'pub-dialog'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        // Optionally reload publications after creation
        this.ngOnInit();
      });
    }

    ngOnInit(): void {
  const user = this.authService.getCurrentUser();
  if (user) {
    this.currentUserId = user._id;
    this.loadPublications();
  } else {
    this.error = 'User not authenticated. Please log in again.';
    console.warn('No user found. Token may be expired or missing.');
  }

  }

  loadPublications(): void {
    this.isLoading = true;
    this.publicationService.getPublications().subscribe({
      next: (data) => {
        this.publications = data;
        this.isLoading = false;

        // Initialize edit forms
        for (let pub of data) {
          this.editForms[pub._id] = this.fb.group({
            titre: [pub.titre],
            description: [pub.description],
            type: [pub.type],
            statut: [pub.statut],
            image: [null] 
          });
        }
      },
      error: (err) => {
        console.error('Error loading publications:', err);
        this.error = 'Failed to load publications';
        this.isLoading = false;
      }
    });
  }

  toggleEdit(pubId: string): void {
    this.editMode[pubId] = !this.editMode[pubId];
  }

  onFileSelected(event: any, pubId: string): void {
    const file = event.target.files[0];
    if (file) {
      this.editForms[pubId].patchValue({ image: file });
    }
  }


  

  updatePublication(pubId: string): void {
    const formData = new FormData();
    const formValue = this.editForms[pubId].value;

    // console.log('Form values:', formValue);//thsi one wokrs it dipaly the data  
    


    formData.append('titre', formValue.titre);
    formData.append('description', formValue.description);
    formData.append('type', formValue.type);
    formData.append('statut', formValue.statut);

    if (formValue.image) {
      formData.append('image', formValue.image);
    }

    // formData.forEach((value, key) => {
    //   console.log(`${key}:`, value);//this one not work it display empty form data
    // });

    this.publicationService.updatePublicationWithForm(pubId, formData).subscribe({
      next: (updatedPub) => {//thsi updatePub is not used why maybe its the error 
        this.editMode[pubId] = false;
        this.loadPublications(); // Refresh the data
      },
      error: () => {
        alert('Error updating publication');
      }
    });
  }

  deletePublication(id: string): void {
    if (confirm('Are you sure you want to delete this publication?')) {
      this.publicationService.deletePublication(id).subscribe({
        next: () => {
          this.publications = this.publications.filter(pub => pub._id !== id);
        },
        error: () => {
          alert('Error deleting publication');
        }
      });
    }
  }

  getImageUrl(imagePath: string): string {
    return `http://localhost:3000/${imagePath}`;
  }

  isAuthor(pub: IPublication): boolean {
    return pub.auteur?._id === this.currentUserId;
  }
}
