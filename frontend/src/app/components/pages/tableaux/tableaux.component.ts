import { Component, OnInit } from '@angular/core';
import { TableauxService } from '../../../services/tableaux.service';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IUser, ITableau } from '../../../utils/models';
import { CommonModule, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TableauComposerComponent } from '../../composer/tableau-composer/tableau-composer.component';

@Component({
  selector: 'app-tableaux',
  // imports: [ NgIf, NgFor, FormsModule, ReactiveFormsModule],
  imports: [NgSwitch, NgSwitchCase, NgIf, NgFor, FormsModule, ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './tableaux.component.html',
  styleUrls: ['./tableaux.component.css']
})
export class TableauxComponent implements OnInit {
  tableaux: ITableau[] = [];
  currentUser: IUser | null = null;
  editMode: Record<string, boolean> = {};
  cellForms: Record<string, FormControl> = {};

  constructor(
    private tableauxService: TableauxService,
    private authService: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTableaux();
  }
  closeDialog() {
    this.dialog.closeAll();
  }
  openCreateTableauDialog(): void {
    const dialogRef = this.dialog.open(TableauComposerComponent, {
      width: '800px', // or 80%, 500px, etc.
      disableClose: true, // Prevent click-outside to close
      panelClass: 'tab-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Optionally reload tableaux after creation
      this.ngOnInit();
    });
  }

  loadTableaux(): void {
    this.tableauxService.getAllTables().subscribe({
      next: (data) => {
        this.tableaux = data;
        console.log('Tableaux reçus:', this.tableaux);
        
        this.initForms(data);
      },
      error: (err) => console.error('Erreur chargement tableaux', err)
    });
  }

  initForms(tableaux: ITableau[]): void {
  for (const tableau of tableaux) {
    for (const ligne of tableau.lignes) {
      if (Array.isArray(ligne.valeurs)) {
        for (const cellule of ligne.valeurs) {
          this.cellForms[cellule._id] = this.fb.control(cellule.valeur);
        }
      } else {
        console.warn('ligne.valeurs is not an array:', ligne.valeurs);
      }
    }
  }
}
  isAuthor(tableau: ITableau): boolean {
    return this.currentUser?._id === tableau.auteur._id;
  }

  toggleEdit(tableauId: string): void {
  if (this.editMode[tableauId]) {
    // on quitte le mode édition, reset les valeurs au backend ou à l'état actuel
    this.loadTableaux();
  }
  this.editMode[tableauId] = !this.editMode[tableauId];
}


  updateCell(cellId: string, colonneType: string): void {
  const control = this.cellForms[cellId];
  const newValue = control.value;

  if (!this.isValidType(newValue, colonneType)) {
    alert(`Type invalide pour ${colonneType}`);
    return;
  }

  this.tableauxService.updateCellule(cellId, { valeur: newValue }).subscribe({
    next: () => {
      console.log('Cellule mise à jour');
      // Mise à jour locale : chercher la cellule dans tableaux et changer sa valeur
      for (const tableau of this.tableaux) {
        for (const ligne of tableau.lignes) {
          const cellule = ligne.valeurs.find(v => v._id === cellId);
          if (cellule) {
            cellule.valeur = newValue;
            break;
          }
        }
      }
    },
    error: () => alert('Erreur lors de la mise à jour de la cellule')
  });
}



  isValidType(value: any, type: string): boolean {
    switch (type) {
      case 'texte': return typeof value === 'string';
      case 'nombre': return !isNaN(Number(value));
      case 'date': return !isNaN(new Date(value).getTime());
      case 'booleen': return value === true || value === false;
      default: return false;
    }
  }

  saveChanges(tableauId: string): void {
  // Trouver le tableau
  const tableau = this.tableaux.find(t => t._id === tableauId);
  if (!tableau) return;

  // Construire un tableau de mises à jour : [{cellId, valeur}]
  const updates = [];
  for (const ligne of tableau.lignes) {
    for (const cellule of ligne.valeurs) {
      const control = this.cellForms[cellule._id];
      if (control && control.dirty) { // seulement si modifié
        const newValue = control.value;
        const colType = tableau.colonnes.find(c => c._id === (typeof cellule.colonne === 'string' ? cellule.colonne : cellule.colonne._id))!.type;
        if (!this.isValidType(newValue, colType)) {
          alert(`Type invalide pour la colonne ${colType}`);
          return;
        }
        updates.push({ cellId: cellule._id, valeur: newValue });
      }
    }
  }

  // Envoyer toutes les mises à jour (par exemple un tableau de requêtes ou un batch API)
  // Supposons que tableauxService a une méthode batchUpdateCells qui prend ce tableau
  this.tableauxService.batchUpdateCells(updates).subscribe({
    next: () => {
      alert('Modifications sauvegardées avec succès');
      this.editMode[tableauId] = false;
      this.loadTableaux(); // reload pour actualiser les données
    },
    error: () => alert('Erreur lors de la sauvegarde')
  });
}

}
