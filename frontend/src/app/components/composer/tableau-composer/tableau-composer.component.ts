import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableauxService } from '../../../services/tableaux.service';
import { CommonModule, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tableau-composer',
  templateUrl: './tableau-composer.component.html',
  styleUrls: ['./tableau-composer.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, NgSwitchCase, NgSwitch, FormsModule, ReactiveFormsModule, CommonModule, ]
})
export class TableauComposerComponent {
  form: FormGroup;
  submitting = false;
  error = '';
  success = '';

  types = ['texte', 'nombre', 'date', 'booleen'];

  constructor(private fb: FormBuilder, private tableauxService: TableauxService, public dialogRef: MatDialogRef<TableauComposerComponent>) {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      typeGraph: ['table'],
      colonnes: this.fb.array([]),
      lignes: this.fb.array([])
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  get colonnes(): FormArray<FormGroup> {
  return this.form.get('colonnes') as FormArray<FormGroup>;
}

  get lignes(): FormArray {
    return this.form.get('lignes') as FormArray;
  }

  addColonne(): void {
    this.colonnes.push(this.fb.group({
      nom: ['', Validators.required],
      type: ['texte', Validators.required]
    }));

    // Add empty value to all rows for the new column
    for (let row of this.lignes.controls) {
      (row.get('valeurs') as FormArray).push(this.fb.control(null));
    }
  }

  removeColonne(index: number): void {
    this.colonnes.removeAt(index);
    for (let row of this.lignes.controls) {
      (row.get('valeurs') as FormArray).removeAt(index);
    }
  }

  addLigne(): void {
    const values = this.fb.array(this.colonnes.controls.map(() => this.fb.control(null)));
    this.lignes.push(this.fb.group({ valeurs: values }));
  }

  removeLigne(index: number): void {
    this.lignes.removeAt(index);
  }

  getValeurControl(rowIndex: number, colIndex: number) {
    return ((this.lignes.at(rowIndex).get('valeurs') as FormArray).at(colIndex)) as FormControl ;
  }

  submit(): void {
    this.error = '';
    this.success = '';
    this.submitting = true;

    if (this.form.invalid) {
      this.error = 'Veuillez remplir tous les champs requis.';
      this.submitting = false;
      return;
    }

    const payload = {
      titre: this.form.value.titre,
      typeGraph: this.form.value.typeGraph,
      colonnes: this.form.value.colonnes,
      lignes: this.form.value.lignes.map((row: any) => ({
        valeurs: row.valeurs.map((val: any, colIndex: number) => ({
          colIndex,
          valeur: this.castValue(this.colonnes.at(colIndex).value.type, val)
        }))
      }))
    };

    this.tableauxService.createTableOneShot(payload).subscribe({
      next: () => {
        this.success = 'Tableau créé avec succès';
        this.form.reset();
        this.colonnes.clear();
        this.lignes.clear();
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la création';
      },
      complete: () => {
        this.submitting = false;
      }
    });
  }

  private castValue(type: string, value: any): any {
    if (type === 'nombre') return Number(value);
    if (type === 'booleen') return value === 'true' || value === true;
    if (type === 'date') return new Date(value);
    return value;
  }
}
