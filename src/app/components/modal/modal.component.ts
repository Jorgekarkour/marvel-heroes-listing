import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatLabel, MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { HeroService } from '@services/hero/hero.service';
import { ModalService } from '@services/modal/modal.service';

const MATERIAL_MODULES = [MatLabel, MatFormField, MatInput, MatDialogModule, MatButtonModule, MatIconModule]

@Component({
  selector: 'app-modal',
  imports: [ReactiveFormsModule, MATERIAL_MODULES],
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit {
  heroForm!: FormGroup;

  private readonly _fb = inject(FormBuilder);
  private readonly _matDialog = inject(MAT_DIALOG_DATA);
  private readonly _heroService = inject(HeroService);
  private readonly _modalService = inject(ModalService);

  ngOnInit(): void {
    this._buildForm();
    this.heroForm.patchValue(this._matDialog.data);
    if(!this._matDialog.isEditing) {
      this._disabledForm();
    }
  }

  onSubmit() {
    let message = 'Contact edited successfully'
    const hero = this.heroForm.value;

    if(this._matDialog.data.id) {
      const updatedHero = {...hero, id: this._matDialog.data.id}
      this._heroService.updateHero(updatedHero);
    } else {
      this._heroService.addHero(hero);
      message = "Contact added successfully"
    }

    this._modalService.closeModal();
  }

  getButtonLabel(): string {
    return this._matDialog.data.id ? 'Edit hero' : 'Create hero';
  }

  private _disabledForm(): void {
    this.heroForm.disable();
  }
  
  private _buildForm(): void {
    this.heroForm = this._fb.nonNullable.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      citizenship: ['', Validators.required],
      skills: ['', Validators.required],
      occupation: ['', Validators.required],
      memberOf: ['', Validators.required],
      creator: ['', Validators.required],
    })
  }
}
