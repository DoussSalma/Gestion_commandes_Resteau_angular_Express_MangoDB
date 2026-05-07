import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { Plat, Categorie, PanierItem } from '../../models/models';

@Component({
  selector: 'app-plats',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './plats.component.html'
})
export class PlatsComponent implements OnInit {
  plats: Plat[] = [];
  platsFiltres: Plat[] = [];
  categories: Categorie[] = [];
  formPlat!: FormGroup;
  showForm = false;
  isEditing = false;
  editId: string = '';
  searchTerm = '';
  categorieFiltre = '';
  triPrix = '';
  panier: PanierItem[] = [];

  // Gestion image : 'upload' ou 'url'
  imageMode: 'upload' | 'url' = 'url';
  previewImage = '';
  uploadLoading = false;

  constructor(
    private service: RestaurantService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPlats();
    this.loadCategories();
    const savedPanier = localStorage.getItem('panier');
    if (savedPanier) this.panier = JSON.parse(savedPanier);
  }

  initForm(): void {
    this.formPlat = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      prix: [0, [Validators.required, Validators.min(0)]],
      image: [''],
      disponible: [true],
      categorie: ['', Validators.required]
    });
    // Réinitialiser l'aperçu image
    this.previewImage = '';
    this.imageMode = 'url';
  }

  loadPlats(): void {
    this.service.getAllPlats().subscribe(
      data => { this.plats = data; this.filtrer(); },
      err => console.error(err)
    );
  }

  loadCategories(): void {
    this.service.getAllCategories().subscribe(
      data => this.categories = data,
      err => console.error(err)
    );
  }

  // Quand l'utilisateur sélectionne un fichier → upload automatique
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.uploadLoading = true;
    const formData = new FormData();
    formData.append('image', file);

    this.http.post<any>('http://localhost:3000/api/upload', formData).subscribe(
      res => {
        this.previewImage = res.imageUrl;
        this.formPlat.patchValue({ image: res.imageUrl });
        this.uploadLoading = false;
      },
      err => {
        alert('Erreur upload: ' + (err.error?.message || err.message));
        this.uploadLoading = false;
      }
    );
  }

  // Filtrage par nom + catégorie + tri par prix
  filtrer(): void {
    let result = this.plats.filter(p => {
      const matchSearch = p.nom.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCat = !this.categorieFiltre || (
        typeof p.categorie === 'object'
          ? (p.categorie as any)._id === this.categorieFiltre
          : p.categorie === this.categorieFiltre
      );
      return matchSearch && matchCat;
    });

    // Tri par prix
    if (this.triPrix === 'asc') result = result.sort((a, b) => a.prix - b.prix);
    else if (this.triPrix === 'desc') result = result.sort((a, b) => b.prix - a.prix);

    this.platsFiltres = result;
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.filtrer();
  }
 // affichage filtrer par categorie
  onCategorieFilter(event: any): void {
    this.categorieFiltre = event.target.value;
    this.filtrer();
  }

  onTriPrix(event: any): void {
    this.triPrix = event.target.value;
    this.filtrer();
  }

  // Naviguer vers la page détail
  voirDetail(id: string): void {
    this.router.navigate(['/plats', id]);
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) { this.isEditing = false; this.initForm(); }
  }

  onSubmit(): void {
    if (this.formPlat.invalid) return;
    if (this.isEditing) {
      this.service.updatePlat(this.editId, this.formPlat.value).subscribe(
        () => { alert('Plat mis à jour!'); this.loadPlats(); this.toggleForm(); },
        err => alert('Erreur: ' + err.error?.message)
      );
    } else {
      this.service.createPlat(this.formPlat.value).subscribe(
        () => { alert('Plat ajouté!'); this.loadPlats(); this.toggleForm(); },
        err => alert('Erreur: ' + err.error?.message)
      );
    }
  }

  onEdit(plat: Plat): void {
    this.isEditing = true;
    this.editId = plat.id!;
    this.showForm = true;
    const catId = typeof plat.categorie === 'object' ? (plat.categorie as Categorie).id : plat.categorie;
    this.formPlat.patchValue({ ...plat, categorie: catId });
    // Afficher l'aperçu de l'image existante
    this.previewImage = plat.image || '';
    this.imageMode = plat.image?.startsWith('http://localhost') ? 'upload' : 'url';
  }

  onDelete(id: string): void {
    if (!confirm('Supprimer ce plat?')) return;
    this.service.deletePlat(id).subscribe(
      () => { alert('Plat supprimé!'); this.loadPlats(); },
      err => alert('Erreur: ' + err.error?.message)
    );
  }

  ajouterAuPanier(plat: Plat): void {
    const item = this.panier.find(p => p.plat.id === plat.id);
    if (item) {
      item.quantite++;
      item.sousTotal = item.quantite * item.plat.prix;
    } else {
      this.panier.push({ plat, quantite: 1, sousTotal: plat.prix });
    }
    localStorage.setItem('panier', JSON.stringify(this.panier));
    alert(`✅ "${plat.nom}" ajouté au panier!`);
  }

  getCategorieNom(plat: Plat): string {
    if (typeof plat.categorie === 'object') return (plat.categorie as Categorie).nom;
    const cat = this.categories.find(c => c.id === plat.categorie);
    return cat ? cat.nom : 'N/A';
  }

  getCategorieIcone(plat: Plat): string {
    if (typeof plat.categorie === 'object') return (plat.categorie as Categorie).icone || '🍽️';
    const cat = this.categories.find(c => c.id === plat.categorie);
    return cat ? cat.icone || '🍽️' : '🍽️';
  }


  onFileSelected(event: any): void {
  const file: File = event.target.files[0];
  if (!file) return;
  this.service.uploadImage(file).subscribe(
    res => {
      this.formPlat.patchValue({ image: res.imageUrl });
      alert('✅ Image uploadée !');
    },
    err => alert('Erreur upload: ' + err.message)
  );
}
}