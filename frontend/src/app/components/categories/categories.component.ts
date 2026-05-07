import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { Categorie } from '../../models/models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  categories: Categorie[] = [];
  formCat!: FormGroup;
  showForm = false;
  isEditing = false;
  editId = '';

  icones = ['🍽️','🥗','🍖','🍕','🍣','🍰','🥤','🍷','🍔','🌮','🍜','🥘'];

  constructor(private service: RestaurantService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.formCat = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      icone: ['🍽️']
    });
  }

  loadCategories(): void {
    this.service.getAllCategories().subscribe(
      data => this.categories = data,
      err => console.error(err)
    );
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) { this.isEditing = false; this.initForm(); }
  }

  onSubmit(): void {
    if (this.formCat.invalid) return;
    if (this.isEditing) {
      this.service.updateCategorie(this.editId, this.formCat.value).subscribe(
        () => { alert('Catégorie mise à jour!'); this.loadCategories(); this.toggleForm(); },
        err => alert('Erreur: ' + err.error?.message)
      );
    } else {
      this.service.createCategorie(this.formCat.value).subscribe(
        () => { alert('Catégorie créée!'); this.loadCategories(); this.toggleForm(); },
        err => alert('Erreur: ' + err.error?.message)
      );
    }
  }

  onEdit(cat: Categorie): void {
    this.isEditing = true;
    this.editId = cat.id!;
    this.showForm = true;
    this.formCat.patchValue(cat);
  }

  onDelete(id: string): void {
    if (!confirm('Supprimer cette catégorie?')) return;
    this.service.deleteCategorie(id).subscribe(
      () => { alert('Catégorie supprimée!'); this.loadCategories(); },
      err => alert('Erreur: ' + err.error?.message)
    );
  }
}
